from __future__ import annotations

import json
from pathlib import Path
from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field

FIXTURES = json.loads((Path(__file__).parent.parent / "data" / "demo.json").read_text())
app = FastAPI(title="CountSafe API", version="0.1.0")


class ReconciliationRequest(BaseModel):
    opening: float = Field(ge=0, le=1_000_000)
    purchased: float = Field(ge=0, le=1_000_000)
    administered: float = Field(ge=0, le=1_000_000)
    waste: float = Field(ge=0, le=1_000_000)
    transferred: float = Field(ge=0, le=1_000_000)
    observed: float = Field(ge=0, le=1_000_000)


class ReconciliationResponse(BaseModel):
    expected: float
    observed: float
    variance: float
    status: Literal["balanced", "review", "critical"]
    audit_steps: list[str]
    disclaimer: str


def reconcile(request: ReconciliationRequest) -> ReconciliationResponse:
    expected = request.opening + request.purchased - request.administered - request.waste - request.transferred
    variance = request.observed - expected
    absolute = abs(variance)
    thresholds = FIXTURES["varianceThresholds"]
    status: Literal["balanced", "review", "critical"] = (
        "critical" if absolute >= thresholds["critical"] else "review" if absolute >= thresholds["watch"] else "balanced"
    )
    return ReconciliationResponse(
        expected=round(expected, 3), observed=round(request.observed, 3), variance=round(variance, 3), status=status,
        audit_steps=FIXTURES["auditSteps"], disclaimer=FIXTURES["disclaimer"],
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/reconcile", response_model=ReconciliationResponse)
def create_reconciliation(request: ReconciliationRequest) -> ReconciliationResponse:
    return reconcile(request)

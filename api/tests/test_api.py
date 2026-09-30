import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health() -> None:
    assert client.get("/health").json() == {"status": "ok"}


def test_reconciliation_flags_shortage() -> None:
    response = client.post("/v1/reconcile", json={"opening":42,"purchased":20,"administered":31.5,"waste":1.5,"transferred":0,"observed":25})
    assert response.status_code == 200
    body = response.json()
    assert body["expected"] == pytest.approx(29)
    assert body["variance"] == pytest.approx(-4)
    assert body["status"] == "critical"
    assert len(body["audit_steps"]) == 4


def test_balanced_count_accepts_fractional_units() -> None:
    response = client.post("/v1/reconcile", json={"opening":10.5,"purchased":5,"administered":3.25,"waste":0.25,"transferred":0,"observed":12})
    assert response.status_code == 200
    assert response.json()["status"] == "balanced"


def test_negative_input_returns_422() -> None:
    response = client.post("/v1/reconcile", json={"opening":-1,"purchased":0,"administered":0,"waste":0,"transferred":0,"observed":0})
    assert response.status_code == 422


def test_missing_fields_returns_422() -> None:
    assert client.post("/v1/reconcile", json={"opening":1}).status_code == 422

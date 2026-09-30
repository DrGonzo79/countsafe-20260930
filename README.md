# CountSafe

A runnable Idea of the Day prototype for monthly controlled-substance inventory reconciliation at independent veterinary clinics.

**Live frontend:** https://drgonzo79.github.io/countsafe-20260930/

## What works

- Switch between two explicitly fictional clinic records or edit the monthly totals.
- Calculate expected inventory, observed variance, and a transparent review level.
- Validate negative values and impossible outflow before reconciliation.
- Inspect the ledger equation and prepare a demo-only exception packet.
- Run the same deterministic domain operation through a typed FastAPI endpoint.

This is training software, not legal/compliance advice. It does not upload photos, alter records, or determine DEA compliance. GitHub Pages hosts only the frontend; the Python service is tested source and is **not deployed**.

## Run and verify

```bash
npm ci
npm run dev
npm run typecheck
npm run test:e2e
npm run build
npm run audit:prod
cd api && uv sync --locked && uv run pytest
```

`POST /v1/reconcile` accepts opening, purchased, administered, waste, transferred, and observed quantities.

Source inspiration: [IdeaBrowser public idea](https://www.ideabrowser.com/hub/ideas/monthly-controlled-drug-reconciliation-for-independent-vet-clinics-38e3fe31). This repository contains a summary, not private newsletter text.

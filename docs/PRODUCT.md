# Product plan

## ICP, JTBD, and wedge

**ICP:** US independent veterinary practices with 2–8 veterinarians, paper/hybrid controlled-drug logs, no full-time compliance specialist, and a practice manager who closes inventory monthly. **JTBD:** “When month end arrives, prove every controlled-substance movement ties out and show me exactly what to investigate before an inspector does.”

The MVP covers one clinic, one period, many drug ledgers: evidence upload, human-confirmed totals, deterministic reconciliation, variance case, reviewer sign-off, immutable packet. This demo covers the central calculation and review experience with fictional data.

## Data model

- `Clinic`, `User`, `DrugLedger`, `Period`
- `EvidenceArtifact` (hash, source, captured_at), `Movement` (purchase/admin/waste/transfer)
- `PhysicalCount`, `Reconciliation`, `ExceptionCase`, `ReviewDecision`, `AuditEvent`

Amounts use fixed-precision decimals and explicit units. Corrections append events; they never overwrite the original.

## Architecture and AI strategy

Next.js supplies the review UI; FastAPI owns validation and deterministic reconciliation. Production adds Postgres, encrypted object storage, tenant RBAC, append-only audit events, and background OCR. AI suggests structured rows with field-level confidence and source coordinates. A human confirms each row; the model never determines compliance or mutates the ledger.

## Economics

Start at $249/month for up to ten drug ledgers plus $49 per additional location. At 85% gross margin after reviewer tooling matures, 400 clinics implies about $1.2M ARR. The danger is reviewer labor: if a close averages over 45 minutes, the wedge is a service business until extraction accuracy improves.

## Validation and GTM

Recruit through state veterinary associations, independent practice-management consultants, and controlled-substance training providers. Run five observed closes, sell three paid concierge pilots, and target: under 30 minutes per close, 100% source traceability, zero silent edits, and at least two renewals after 90 days. Do not use settlement fear as deceptive marketing.

## Moat, risks, roadmap

The moat is a trusted, vendor-neutral corpus of confirmed evidence-to-ledger mappings, workflow integrations, and a reputation for auditable provenance—not the reconciliation arithmetic. Risks: legal positioning, sensitive operational data, OCR errors, unit conversion, insider abuse, changing guidance, and long-tail integrations.

- **0–30 days:** paid concierge closes, workflow observation, legal/compliance review.
- **31–60 days:** evidence vault, double-entry/reviewer workflow, pilot integrations, unit-normalization tests.
- **61–90 days:** exception analytics, export templates, association channel test, explicit go/no-go on OCR automation.

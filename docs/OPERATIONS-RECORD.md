# Public operations record

`src/data/operations.json` is the single canonical source for `/operations/` and
the generated `/operations.json` download. Each published project has one entry
and a stable `/operations/#<project-id>` link. Project apps link there from their
existing About/help/footer surface. This site and topic views remain static.

To refresh, inspect the relevant provider account read-only, record the reporting
month and observation date, and update verified values only. Shared workspace
quotas appear once, not once per application. `null` means unmeasured; never fill
it with zero or infer app hours from elapsed deployment age. GitHub Pages projects
do not use Render hours, but can use external services and bandwidth.

Service costs cover the published collection. Funding is founder-reported.
Personal hardware, electricity and development tools are outside this initial
record. Do not publish account IDs, credentials, payment information, raw logs or
personal telemetry. Add a new provider/resource type only when actually needed.

The initial September 11 observation came from the signed-in Render billing
dashboard: Hobby/no card, three services, $0 current and projected charges,
9.52/750 free hours, 8 MB/5 GB bandwidth, and 5/500 build minutes. Its per-service
Free billing rows do not reconcile with the shared free-hour counter; those rows
are not used as per-app pool allocations. No live metrics API or background
collector is part of this version. Provider counters can lag activity.

The parser checks numeric validity, unique IDs and exact coverage of published
projects. Run `npm run verify` before publication and check the live page, JSON
download and all project fragment links afterward. Commit history preserves
earlier snapshots. If updates stop, keep the observation date visible; do not
label the last known values live or current.

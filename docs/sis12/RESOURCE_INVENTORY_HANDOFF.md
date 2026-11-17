# SIS12-05 Handoff Rows for Resource Inventory

These rows are additive handoff material for the existing
[RESOURCE_INVENTORY.md](RESOURCE_INVENTORY.md). The existing Danaya/PM file is
not overwritten.

| Category | Resource | Planned | Actual | Difference | Issue | Solution | Owner |
|---|---|---|---|---|---|---|---|
| Technical | SQLite fixture | 3/6/6 rows; no byte baseline | 36,864 bytes; 3/6/6; FK clean | Rows 0; bytes N/A | No production growth/backup basis | Add migration and backup policy | Gleb |
| Technical | GitHub repository/CI | Branch/PR workflow; no CI quota target | Public repo; 3,289 KB API size; 0 workflows | N/A | Plan/quota unknown; no CI | Confirm plan; decide CI scope | Yerassyl |
| Technical | Local runtime/build | Local backend/frontend; no timing SLA | 126 tests/1.22s; build/0.59s; workspace 80M | N/A | Machine/version dependent | Standardize runtime and CI baseline | Gleb/Yerassyl |

#!/usr/bin/env bash
set -euo pipefail

# Run from the isolated combined checkout. Supply an empty output directory.
: "${FEEDBACK_OUTPUT:?Set FEEDBACK_OUTPUT to an absolute output directory}"
mkdir -p "$FEEDBACK_OUTPUT"
work=$(mktemp -d "$FEEDBACK_OUTPUT/.feedback-check.XXXXXX")
db="$work/fixture.db"
backend_pid=
frontend_pid=
stop_backend() {
  if [[ -n "$backend_pid" ]]; then
    kill "$backend_pid" 2>/dev/null || true
    wait "$backend_pid" 2>/dev/null || true
    backend_pid=
  fi
}
cleanup() {
  stop_backend
  if [[ -n "$frontend_pid" ]]; then
    kill "$frontend_pid" 2>/dev/null || true
    wait "$frontend_pid" 2>/dev/null || true
  fi
  rm -rf "$work"
  rm -f "$FEEDBACK_OUTPUT/feedback-payloads.local.json"
}
trap cleanup EXIT

wait_url() {
  for _ in {1..40}; do
    if curl -fsS "$1" >/dev/null 2>&1; then return; fi
    sleep .25
  done
  return 1
}
start_backend() {
  SMARTCAMPUS_DB_PATH="$db" OPENAI_API_KEY='' GROQ_API_KEY='' python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8004 >"$work/api.log" 2>&1 &
  backend_pid=$!
  wait_url http://127.0.0.1:8004/api/health || { cat "$work/api.log"; return 1; }
}

python database/seed.py --db "$db" | sed 's#Seeded .*: #Fresh seed: #'
start_backend
# Use a temporary Vite configuration to keep the check independent of port 8000.
printf '%s\n' "export default { server: { proxy: { '/api': 'http://127.0.0.1:8004' } } }" > "$work/vite.config.mjs"
(
  cd frontend
  exec node node_modules/vite/bin/vite.js --config "$work/vite.config.mjs" --host 127.0.0.1 --port 5187 --strictPort
) >"$work/vite.log" 2>&1 &
frontend_pid=$!
wait_url http://127.0.0.1:5187 || { cat "$work/vite.log"; exit 1; }
(cd frontend && node ../docs/sis1011/evidence/feedback-feature/feedback-persistence-browser.mjs)

stop_backend
python database/seed.py --db "$db" | sed 's#Seeded .*: #Repeat seed: #'
start_backend
python - "$db" "$FEEDBACK_OUTPUT/feedback-payloads.local.json" <<'PY'
import json
import sqlite3
import sys
import urllib.error
import urllib.request
from contextlib import closing
from pathlib import Path

db, payload_file = sys.argv[1:]
payloads = json.loads(Path(payload_file).read_text())
endpoint = "http://127.0.0.1:8004/api/feedback"

def post(payload):
    request = urllib.request.Request(endpoint, data=json.dumps(payload).encode(),
                                     headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(request) as response:
            return response.status
    except urllib.error.HTTPError as error:
        return error.code

assert post(payloads[0]) == 409
assert post(dict(payloads[0], response_id="invalid")) == 422
with closing(sqlite3.connect(db)) as connection:
    rows = connection.execute(
        "SELECT response_id, rating, issue_type, comment, source_ids, created_at FROM feedback ORDER BY id"
    ).fetchall()
    assert len(rows) == 2, rows
    for row, payload in zip(rows, payloads):
        assert row[:4] == (payload["response_id"], payload["rating"],
                          payload.get("issue_type"), payload.get("comment"))
        assert json.loads(row[4]) == payload["source_ids"]
        assert row[5].endswith("+00:00")
    assert connection.execute("SELECT count(*) FROM deadlines").fetchone()[0] == 6
print("After backend restart and reseed: original two feedback rows and all six deadlines retained.")
print("Duplicate UUID returned 409 and invalid UUID returned 422 with no additional rows.")
PY

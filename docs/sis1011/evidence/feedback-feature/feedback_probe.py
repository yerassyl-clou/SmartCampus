"""Run at repo root with PYTHONPATH=backend:database:backend/tests.

Uses the explicitly test-only SQLite interface harness from test_feedback.
Does not claim production storage/migration or browser integration.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
import json
import os
import subprocess

from seed import load_database
from test_feedback import storage, sqlite_harness, client, route, app, rows

results = []
with TemporaryDirectory() as folder:
    path = Path(folder) / 'feedback.db'
    os.environ['SMARTCAMPUS_DB_PATH'] = str(path)
    load_database(path)
    scope = storage.__wrapped__(path)
    next(scope)
    try:
        positive = {'response_id':'a2b64e7c-0c29-4d18-8f80-9cd688a9e950', 'rating':'helpful', 'source_ids':[1,-1]}
        cases = [('helpful', positive), ('duplicate', positive),
                 ('negative', {'response_id':'c37ef168-172c-4225-bacf-f66dbe626540', 'rating':'not_helpful', 'issue_type':'other', 'comment':'  Review sample information.  '}),
                 ('invalid_uuid', {**positive, 'response_id':'invalid'}),
                 ('missing_category', {**positive, 'rating':'not_helpful'})]
        for case, payload in cases:
            response = client.post('/api/feedback', json=payload)
            results.append({'case':case, 'request':payload, 'status':response.status_code, 'body':response.json()})
        persisted = rows(path)
        app.dependency_overrides[route.get_feedback_store] = lambda: sqlite_harness(Path(folder)/'missing.db')
        response = client.post('/api/feedback', json=positive)
        results.append({'case':'missing_database', 'status':response.status_code, 'body':response.json(),
                        'category':response.headers.get('X-SmartCampus-Error')})
        app.dependency_overrides[route.get_feedback_store] = lambda: None
        response = client.post('/api/feedback', json=positive)
        results.append({'case':'missing_production_helper', 'status':response.status_code, 'body':response.json()})
    finally:
        scope.close()

print(json.dumps({'base_revision':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),
                  'revision_note':'Feedback route patch applied to base; final source revision is PR head.',
                  'storage':'test-only SQLite harness; production SIS1011-13 integration pending',
                  'results':results,'persisted_rows':persisted},indent=2))

"""Run from repository root: PYTHONPATH=backend:database python <this file>."""
import importlib
import json
import os
from pathlib import Path
import platform
import subprocess
import tempfile
from unittest.mock import patch

from fastapi.testclient import TestClient
from seed import load_database
from app.main import app
from app.retrieval import search_course_materials
from app.schemas import EvidenceSelection
from app.services.llm import ProviderUnavailable

route = importlib.import_module('app.routes.chat')
rows = []

def record(case, feature, question, expected, actual, passed, mode):
    rows.append(dict(id=case, feature=feature, input=question, expected=expected,
                     actual=actual, result='PASS' if passed else 'FAIL', provider=mode))

def quote_first(question, sources):
    source = sources[0]
    return EvidenceSelection(sufficient=True, quotes=[{'source_id': source['id'], 'quote': source['excerpt']}])

with tempfile.TemporaryDirectory() as folder:
    os.environ['SMARTCAMPUS_DB_PATH'] = str(Path(folder) / 'probe.db')
    load_database(Path(os.environ['SMARTCAMPUS_DB_PATH']))
    client = TestClient(app)
    for case, question, course, expected_id in [
        ('AI-01', 'Assignment 2 deadline', 1, 1),
        ('AI-02', 'What is the rule for late database lab work?', 1, 2),
    ]:
        with patch.object(route, 'select_evidence', side_effect=quote_first):
            response = client.post('/api/chat', json={'question': question, 'course_id': course})
        data = response.json()
        passed = response.status_code == 200 and data['grounded'] and data['sources'][0]['id'] == expected_id
        passed = passed and data['sources'][0]['excerpt'] in data['answer']
        record(case, 'Chat', question + f'; course_id={course}', '200, verified verbatim source ' + str(expected_id),
               {'status': response.status_code, 'body': data}, passed, 'mocked deterministic quote selector')
    for case, question, course in [('AI-03', 'When is the Physics exam?', None), ('AI-04', 'Assignment 2', 999)]:
        with patch.object(route, 'select_evidence', side_effect=AssertionError('Provider must not run')) as provider:
            response = client.post('/api/chat', json={'question': question, 'course_id': course})
        data = response.json()
        record(case, 'Chat', question + f'; course_id={course}', '200 fallback, no sources or provider call',
               {'status': response.status_code, 'body': data, 'provider_calls': provider.call_count},
               response.status_code == 200 and not data['grounded'] and not data['sources'] and not provider.called, 'provider forbidden')
    with patch.object(route, 'select_evidence', side_effect=ProviderUnavailable(category='unavailable')):
        response = client.post('/api/chat', json={'question': 'Assignment 2'})
    record('AI-05', 'Chat', 'Assignment 2; selector raises ProviderUnavailable', '503 safe unavailable category',
           {'status': response.status_code, 'body': response.json(), 'category': response.headers.get('X-SmartCampus-Error')},
           response.status_code == 503 and response.headers.get('X-SmartCampus-Error') == 'unavailable', 'mocked failure')
    with patch.object(route, 'select_evidence', return_value=EvidenceSelection(sufficient=True, quotes=[{'source_id': 1, 'quote': 'Invented deadline 2099-01-01'}])):
        response = client.post('/api/chat', json={'question': 'Assignment 2'})
    record('AI-06', 'Chat', 'Assignment 2; selector returns invented quote', '200 safe fallback', response.json(),
           response.status_code == 200 and not response.json()['grounded'], 'mocked invalid quote')
    for case, question, course, first in [
        ('AI-07', 'assignments 2 requirements', None, 1),
        ('AI-08', 'What is the rule for late database lab work?', None, 2),
        ('AI-09', 'Assignment 999', None, None),
        ('AI-10', 'When is the Human-Computer Interaction Assignment 2 due?', None, None),
        ('AI-11', 'When is the Human-Computer Interaction Assignment 2 due?', 3, None),
    ]:
        sources = search_course_materials(question, course_id=course)
        passed = (sources[0]['id'] == first) if first is not None and sources else (first is None and not sources)
        record(case, 'Knowledge Retrieval', question + f'; course_id={course}', 'No candidates' if first is None else f'First source {first}', sources, passed, 'no provider')
    question = 'When is the Human-Computer Interaction Assignment 2 due?'
    with patch.object(route, 'select_evidence', side_effect=quote_first):
        response = client.post('/api/chat', json={'question': question})
    record('AI-12', 'Chat', question, 'Fallback; no unrelated course evidence', response.json(),
           response.status_code == 200 and not response.json()['grounded'], 'mocked deterministic quote selector; not live model behavior')

result = {'revision': subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip(),
          'environment': platform.platform() + ' Python ' + platform.python_version(), 'cases': rows}
print(json.dumps(result, indent=2))

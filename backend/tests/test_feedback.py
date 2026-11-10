"""Route + real SQLite tests using an explicit SIS1011-13 interface harness.

This test-only helper is not Gleb's production persistence/migration code.
"""
from contextlib import closing
import importlib
import json
import sqlite3
from types import SimpleNamespace
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.db import DatabaseUnavailable, get_connection
from app.main import app

route = importlib.import_module('app.routes.feedback')
client = TestClient(app)


class DuplicateFeedback(Exception):
    pass


def sqlite_harness(path):
    def save_feedback(*, response_id, rating, issue_type, comment, source_ids):
        try:
            with closing(get_connection(path)) as connection, connection:
                cursor = connection.execute(
                    'INSERT INTO feedback (response_id,rating,issue_type,comment,source_ids) VALUES (?,?,?,?,?)',
                    (response_id, rating, issue_type, comment, json.dumps(source_ids)),
                )
                return cursor.lastrowid
        except sqlite3.IntegrityError as error:
            if error.sqlite_errorname == 'SQLITE_CONSTRAINT_UNIQUE':
                raise DuplicateFeedback() from None
            raise DatabaseUnavailable() from None
        except sqlite3.DatabaseError:
            raise DatabaseUnavailable() from None
    return SimpleNamespace(save_feedback=save_feedback, DuplicateFeedback=DuplicateFeedback)


@pytest.fixture
def storage(database):
    # Test-only table/harness. Production DDL and upgrade belong to SIS1011-13.
    with sqlite3.connect(database) as connection:
        connection.execute('''CREATE TABLE feedback (
            id INTEGER PRIMARY KEY, response_id TEXT NOT NULL UNIQUE,
            rating TEXT NOT NULL, issue_type TEXT, comment TEXT,
            source_ids TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )''')
    store = sqlite_harness(database)
    app.dependency_overrides[route.get_feedback_store] = lambda: store
    yield store
    app.dependency_overrides.pop(route.get_feedback_store, None)


def payload(**updates):
    return {'response_id': str(uuid4()), 'rating': 'helpful', **updates}


def rows(database):
    with closing(get_connection(database)) as connection:
        return [dict(row) for row in connection.execute('SELECT * FROM feedback')]


def test_helpful_commits_and_reopens(storage, database):
    data = payload(source_ids=[1, -1])
    result = client.post('/api/feedback', json=data)
    assert result.status_code == 201
    assert result.json() == {'id': 1, 'status': 'saved'}
    # Separate SQLite connection observes the committed row, not an in-memory fake.
    record = rows(database)[0]
    assert record['response_id'] == data['response_id']
    assert record['rating'] == 'helpful' and record['issue_type'] is None
    assert record['comment'] is None and json.loads(record['source_ids']) == [1, -1]
    assert record['created_at']
    app.dependency_overrides[route.get_feedback_store] = lambda: sqlite_harness(database)
    assert client.post('/api/feedback', json=data).status_code == 409
    assert len(rows(database)) == 1


@pytest.mark.parametrize('category', ['incorrect_information', 'outdated_information', 'missing_information', 'other'])
def test_negative_categories_and_comment(storage, database, category):
    result = client.post('/api/feedback', json=payload(rating='not_helpful', issue_type=category,
                                                     comment='  text\x00\u202e\nnext\tline  '))
    assert result.status_code == 201
    assert rows(database)[0]['issue_type'] == category
    assert rows(database)[0]['comment'] == 'text\nnext\tline'


@pytest.mark.parametrize('comment,expected', [(None, None), ('   ', None), ('x'*500, 'x'*500),
                                             ('<b>plain text</b>', '<b>plain text</b>')])
def test_optional_plain_text_comment(storage, database, comment, expected):
    assert client.post('/api/feedback', json=payload(comment=comment)).status_code == 201
    assert rows(database)[0]['comment'] == expected


@pytest.mark.parametrize('updates', [
    {'response_id':'bad'}, {'response_id':'550e8400-e29b-11d4-a716-446655440000'},
    {'response_id':None}, {'rating':'bad'}, {'rating':True},
    {'rating':'not_helpful'}, {'rating':'not_helpful', 'issue_type':None},
    {'issue_type':'wrong'}, {'comment':'x'*501}, {'comment':123},
    {'source_ids':[True]}, {'source_ids':['1']}, {'source_ids':[1.5]}, {'source_ids':[0]},
    {'source_ids':[2**63]}, {'source_ids':None}, {'source_ids':'1'}, {'student_id':'unused'},
])
def test_invalid_never_writes(storage, database, updates):
    assert client.post('/api/feedback', json=payload(**updates)).status_code == 422
    assert rows(database) == []


def test_duplicate_canonical_uuid_does_not_overwrite(storage, database):
    data = payload(comment='original')
    assert client.post('/api/feedback', json=data).status_code == 201
    result = client.post('/api/feedback', json={**data, 'response_id':data['response_id'].upper(),
                                               'rating':'not_helpful', 'issue_type':'other', 'comment':'replacement'})
    assert result.status_code == 409
    assert result.json() == {'detail':'Feedback has already been submitted for this response.'}
    assert len(rows(database)) == 1 and rows(database)[0]['comment'] == 'original'


def test_concurrent_duplicate_submissions(storage, database):
    from concurrent.futures import ThreadPoolExecutor
    data = payload()
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda _: client.post('/api/feedback', json=data).status_code, range(2)))
    assert sorted(results) == [201, 409]
    assert len(rows(database)) == 1


def test_malformed_json_never_writes(storage, database):
    assert client.post('/api/feedback', content='{', headers={'Content-Type':'application/json'}).status_code == 422
    assert rows(database) == []


def assert_unavailable(result):
    assert result.status_code == 503
    assert result.headers['X-SmartCampus-Error'] == 'feedback_unavailable'
    assert result.json() == {'detail':'Feedback storage is temporarily unavailable. Please try again later.'}


def test_missing_helper_is_safe(monkeypatch):
    def missing(name):
        raise ModuleNotFoundError(name=name)
    monkeypatch.setattr(route, 'import_module', missing)
    assert_unavailable(client.post('/api/feedback', json=payload()))
    assert client.get('/api/health').status_code == 200


@pytest.mark.parametrize('kind', ['missing', 'uninitialized', 'corrupt'])
def test_database_errors_are_safe(storage, tmp_path, kind, caplog):
    path = tmp_path / 'private-location.db'
    if kind == 'uninitialized': path.touch()
    if kind == 'corrupt': path.write_text('not sqlite')
    app.dependency_overrides[route.get_feedback_store] = lambda: sqlite_harness(path)
    result = client.post('/api/feedback', json=payload(comment='PRIVATE-COMMENT'))
    assert_unavailable(result)
    assert 'PRIVATE-COMMENT' not in result.text + caplog.text
    assert str(path) not in result.text + caplog.text
    assert 'feedback_unavailable' in caplog.text
    if kind == 'missing': assert not path.exists()


def test_helper_load_uses_documented_interface(monkeypatch, storage):
    app.dependency_overrides.pop(route.get_feedback_store)
    monkeypatch.setattr(route, 'import_module', lambda name: storage)
    assert client.post('/api/feedback', json=payload()).status_code == 201


def test_no_public_listing_or_chat_schema_change(storage):
    assert client.get('/api/feedback').status_code == 405
    spec = client.get('/openapi.json').json()
    assert set(spec['paths']['/api/feedback']) == {'post'}
    assert '201' in spec['paths']['/api/feedback']['post']['responses']
    assert set(spec['components']['schemas']['ChatResponse']['properties']) == {'answer','sources','grounded'}

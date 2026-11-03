from contextlib import closing
import sqlite3

import pytest
from fastapi.testclient import TestClient

from app.db import get_connection, get_database_path
from app.main import app
from app.retrieval import search_course_materials, list_deadlines
from seed import load_database, SCHEMA_PATH

client = TestClient(app)


def test_seed_repeatable_and_foreign_keys(database):
    assert load_database(database) == (3, 6, 6)
    assert load_database(database) == (3, 6, 6)
    with closing(get_connection(database)) as connection:
        assert connection.execute('PRAGMA foreign_key_check').fetchall() == []
        with pytest.raises(sqlite3.IntegrityError):
            connection.execute("INSERT INTO deadlines VALUES (99,999,'Bad','2026-11-01','Test')")
        connection.rollback()


def test_path_independent_of_working_directory(monkeypatch, tmp_path):
    monkeypatch.setenv('SMARTCAMPUS_DB_PATH', '../database/smartcampus.db')
    path = get_database_path().resolve()
    monkeypatch.chdir(tmp_path)
    assert get_database_path().resolve() == path
    assert path.name == 'smartcampus.db' and path.parent.name == 'database'


def test_deadlines(database):
    response = client.get('/api/deadlines')
    assert response.status_code == 200
    data = response.json()
    assert data['total'] == len(data['items']) == 6
    assert [i['id'] for i in data['items']] == [1, 3, 5, 2, 4, 6]
    assert [i['due_date'] for i in data['items']] == [
        '2026-11-06', '2026-11-09', '2026-11-11', '2026-11-13', '2026-11-20', '2026-11-27']
    assert set(data['items'][0]) == {'id','course_id','course_name','title','due_date','source_title'}
    for course in (1, 2, 3):
        filtered = client.get('/api/deadlines', params={'course_id': course}).json()
        assert filtered['total'] == 2
        assert all(i['course_id'] == course for i in filtered['items'])
    assert client.get('/api/deadlines?course_id=999').json() == {'items': [], 'total': 0}


@pytest.mark.parametrize('course', ['0', '-1', 'abc', '1 OR 1=1'])
def test_invalid_deadline_filter(course):
    assert client.get('/api/deadlines', params={'course_id':course}).status_code == 422


def test_empty_initialized_database(tmp_path, monkeypatch):
    path = tmp_path / 'empty.db'
    with sqlite3.connect(path) as connection:
        connection.executescript(SCHEMA_PATH.read_text())
    monkeypatch.setenv('SMARTCAMPUS_DB_PATH', str(path))
    assert client.get('/api/deadlines').json() == {'items': [], 'total': 0}
    assert client.post('/api/chat', json={'question':'Assignment 2'}).json()['grounded'] is False


@pytest.mark.parametrize('kind', ['missing', 'uninitialized', 'corrupt'])
def test_unavailable_database(tmp_path, monkeypatch, kind):
    path = tmp_path / 'unavailable.db'
    if kind == 'uninitialized':
        path.touch()
    if kind == 'corrupt':
        path.write_text('not a SQLite file')
    monkeypatch.setenv('SMARTCAMPUS_DB_PATH', str(path))
    for url, payload in [('/api/deadlines',None),('/api/chat',{'question':'Assignment 2'}),
                         ('/api/chat',{'question':'Show all deadlines'})]:
        response = client.get(url) if payload is None else client.post(url,json=payload)
        assert response.status_code == 503
        assert response.headers['X-SmartCampus-Error'] == 'database_unavailable'
        assert str(path) not in response.text
    assert client.get('/api/health').status_code == 200
    if kind == 'missing':
        assert not path.exists()


@pytest.mark.parametrize('question,expected_id', [
    ('When is Assignment 2 due?',1), ('What should I submit for Assignment 2?',1),
    ('What is the rule for late database lab work?',2),
    ('When is the risk register review due?',3), ('What must the risk register include?',3),
    ('When is the usability test plan due?',5), ('What should the usability test plan describe?',5),
    ('assignment 2 requirement',1), ('assignments 2 requirements',1),
    ('prototype critiques',6),
])
def test_retrieval_ranks_evidence(question, expected_id):
    sources = search_course_materials(question)
    assert sources[0]['id'] == expected_id
    assert len({s['id'] for s in sources}) == len(sources)


@pytest.mark.parametrize('question', ["What is the rector's personal phone number?", 'When is the Physics exam?',
                                     'Assignment 999', 'the is what', 'zzzzquux'])
def test_no_weak_matches(question):
    assert search_course_materials(question) == []


def test_filters_limits_and_deadline_only_facts():
    assert search_course_materials('Assignment 2', course_id=2) == []
    assert search_course_materials('risk register', limit=1)[0]['id'] == 3
    assert search_course_materials('Assignment 2', limit=0) == []
    sources = search_course_materials('When is the midterm project proposal due?')
    assert any(s['id'] == -2 and '2026-11-13' in s['excerpt'] for s in sources)
    assert search_course_materials('deadline Assignment 2') == search_course_materials('deadlines assignments 2')

"""SC-ISS-002: named courses must constrain eligible evidence."""
import importlib
from unittest.mock import Mock
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.retrieval import search_course_materials

route = importlib.import_module('app.routes.chat')
QUESTION = 'When is the Human-Computer Interaction Assignment 2 due?'

@pytest.mark.parametrize('question', [QUESTION, QUESTION.lower(), 'When is the Human Computer Interaction Assignment 2 due?'])
def test_named_course_cannot_borrow_other_course_assignment(question):
    assert search_course_materials(question) == []

def test_named_course_api_fallback_before_provider(monkeypatch):
    provider = Mock(side_effect=AssertionError('No unrelated provider candidates'))
    monkeypatch.setattr(route, 'select_evidence', provider)
    response = TestClient(app).post('/api/chat', json={'question': QUESTION})
    assert response.status_code == 200
    assert response.json() == {'answer': route.FALLBACK, 'sources': [], 'grounded': False}
    provider.assert_not_called()

def test_matching_named_course_still_returns_assignment():
    assert [s['id'] for s in search_course_materials('When is the Database Systems Assignment 2 due?')] == [1, -1]

@pytest.mark.parametrize('question,course_id', [
    ('Database Systems Assignment 2', 3),
    ('Database Systems and Human-Computer Interaction Assignment 2', None),
])
def test_conflicting_course_scope_is_safe(question, course_id):
    assert search_course_materials(question, course_id=course_id) == []

def test_explicit_filter_and_boundaries():
    assert search_course_materials('Assignment 2', course_id=1)[0]['id'] == 1
    assert search_course_materials(QUESTION, course_id=3) == []
    # A course name embedded inside another word is not a recognized mention.
    assert search_course_materials('xDatabase Systemsx Assignment 2')[0]['id'] == 1

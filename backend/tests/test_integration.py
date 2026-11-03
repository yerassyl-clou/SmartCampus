from datetime import date
import importlib
from unittest.mock import Mock

import httpx
import openai
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.schemas import EvidenceSelection
from app.services import llm
from app.retrieval import list_deadlines

route = importlib.import_module('app.routes.chat')
client = TestClient(app)


@pytest.mark.parametrize('question', ['What deadlines do I have?', 'what deadlines i have',
    'Show all deadlines', 'What assignments are due?', 'List upcoming deadlines'])
def test_deadline_questions_without_provider(monkeypatch, question):
    monkeypatch.setattr(route, 'select_evidence', Mock(side_effect=AssertionError('No LLM for listing')))
    monkeypatch.setattr(route, 'reference_date', lambda: date(2026,11,3))
    data = client.post('/api/chat',json={'question':question}).json()
    assert data['grounded'] is True
    assert 'Fictional sample' in data['answer'] and 'not a personal schedule' in data['answer']
    assert len(data['sources']) == 6
    for item, source in zip(list_deadlines(), data['sources']):
        assert source['id'] == -item['id']
        assert item['due_date'] in source['excerpt'] and item['title'] in source['excerpt']
    assert [s['id'] for s in data['sources']] == [-1,-3,-5,-2,-4,-6]


@pytest.mark.parametrize('day,expected', [(6,6),(10,4),(27,1),(28,0)])
def test_upcoming_reference_date(monkeypatch,day,expected):
    monkeypatch.setattr(route, 'reference_date', lambda: date(2026,11,day))
    data = client.post('/api/chat',json={'question':'List upcoming deadlines'}).json()
    assert len(data['sources']) == expected
    assert f'2026-11-{day:02}' in data['answer'] and 'Asia/Almaty' in data['answer']


def test_listing_respects_course_filter():
    assert len(client.post('/api/chat',json={'question':'Show all deadlines','course_id':1}).json()['sources']) == 2
    assert client.post('/api/chat',json={'question':'Show all deadlines','course_id':999}).json()['sources'] == []


@pytest.mark.parametrize('question', ['When is the Physics exam?', "What is the rector's personal phone number?", 'Show Physics deadlines'])
def test_missing_info_without_provider(monkeypatch, question):
    monkeypatch.setattr(route,'select_evidence',Mock(side_effect=AssertionError('No irrelevant LLM call')))
    response = client.post('/api/chat',json={'question':question})
    assert response.status_code == 200
    assert response.json() == {'answer':route.FALLBACK,'grounded':False,'sources':[]}


@pytest.mark.parametrize('kind,status,category', [
    (openai.AuthenticationError,401,'authentication'), (openai.PermissionDeniedError,403,'rejection'),
    (openai.BadRequestError,400,'rejection'), (openai.NotFoundError,404,'rejection'),
    (openai.RateLimitError,429,'rate_limit'), (openai.APIStatusError,503,'unavailable'),
    (openai.APITimeoutError,None,'timeout'), (openai.APIConnectionError,None,'unavailable')])
def test_diagnostics_are_safe(monkeypatch, caplog, kind, status, category):
    request = httpx.Request('POST','https://provider.invalid')
    error = kind('SECRET-DO-NOT-LOG',response=httpx.Response(status,request=request),body={}) if status else kind(request=request)
    provider = Mock()
    provider.__enter__ = Mock(return_value=provider)
    provider.__exit__ = Mock(return_value=False)
    provider.beta.chat.completions.parse.side_effect = error
    monkeypatch.setattr(llm,'OpenAI',Mock(return_value=provider))
    response=client.post('/api/chat',json={'question':'Assignment 2'})
    assert response.status_code == 503
    assert response.headers['X-SmartCampus-Error'] == category
    assert f'category={category}' in caplog.text
    assert 'SECRET-DO-NOT-LOG' not in response.text + caplog.text


@pytest.mark.parametrize('result', ['missing','malformed','empty'])
def test_invalid_model_output_is_service_failure(monkeypatch, result):
    provider = Mock()
    provider.__enter__ = Mock(return_value=provider)
    provider.__exit__ = Mock(return_value=False)
    parse = provider.beta.chat.completions.parse
    if result == 'malformed':
        parse.side_effect = ValueError('SECRET')
    else:
        parse.return_value.choices = [] if result == 'empty' else [Mock(message=Mock(parsed=None))]
    monkeypatch.setattr(llm,'OpenAI',Mock(return_value=provider))
    response=client.post('/api/chat',json={'question':'Assignment 2'})
    assert response.status_code == 503
    assert response.headers['X-SmartCampus-Error'] == 'invalid_output'
    assert route.FALLBACK not in response.text and 'SECRET' not in response.text


@pytest.mark.parametrize('payload', [{'sufficient':'true','quotes':[]},
    {'sufficient':True,'quotes':[{'source_id':'1','quote':'valid'}]},
    {'sufficient':True,'quotes':[],'answer':'invented'}])
def test_strict_evidence_schema(payload):
    with pytest.raises(ValueError):
        EvidenceSelection.model_validate(payload)


def test_question_length_limit():
    assert client.post('/api/chat',json={'question':'x'*4001}).status_code == 422


def test_listing_does_not_discard_numeric_qualifiers():
    from app.schemas import ChatRequest
    assert route.deadline_listing(ChatRequest(question='Show all deadlines 2027')) is None

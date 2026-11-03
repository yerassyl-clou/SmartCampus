import importlib
from pathlib import Path
from unittest.mock import Mock
import sys
import pytest
import httpx
import openai
from fastapi.testclient import TestClient
from app.main import app
from app.schemas import EvidenceSelection
from app.services import llm

route = importlib.import_module('app.routes.chat')
client = TestClient(app)

@pytest.fixture(autouse=True)
def database(tmp_path, monkeypatch):
    sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'database'))
    from seed import load_database
    path = tmp_path / 'test.db'
    load_database(path)
    monkeypatch.setenv('SMARTCAMPUS_DB_PATH', str(path))

@pytest.mark.parametrize('question', ['', '   ', None, 123])
def test_invalid(question):
    assert client.post('/api/chat', json={'question':question}).status_code == 422

@pytest.mark.parametrize('payload', [{'question':'zzzzquux'}, {'question':'Assignment 2','course_id':999}])
def test_no_provider(monkeypatch,payload):
    provider = Mock(side_effect=AssertionError('Must not call provider'))
    monkeypatch.setattr(route,'select_evidence',provider)
    assert client.post('/api/chat',json=payload).json() == {'answer':route.FALLBACK,'grounded':False,'sources':[]}
    provider.assert_not_called()

@pytest.mark.parametrize('question,source_id,quote', [
 ('Assignment 2 deadline',1,'Assignment 2 deadline: 2026-11-06.'),
 ('Late database lab work',2,'Late database lab work may be submitted within three calendar days with a short explanation.')])
def test_grounded(monkeypatch,question,source_id,quote):
    def select(question,sources):
        assert any(s['id']==source_id and quote in s['excerpt'] for s in sources)
        return EvidenceSelection(sufficient=True,quotes=[{'source_id':source_id,'quote':quote}])
    monkeypatch.setattr(route,'select_evidence',select)
    result=client.post('/api/chat',json={'question':question,'course_id':1}).json()
    assert result['grounded'] is True
    assert quote in result['answer']
    assert result['sources'][0]['title'] in result['answer']

@pytest.mark.parametrize('selection', [
 {'sufficient':False,'quotes':[]}, {'sufficient':True,'quotes':[]},
 {'sufficient':True,'quotes':[{'source_id':999,'quote':'Fake'}]},
 {'sufficient':True,'quotes':[{'source_id':1,'quote':'Deadline 2099-01-01'}]}])
def test_unverifiable(monkeypatch,selection):
    monkeypatch.setattr(route,'select_evidence',lambda *a:EvidenceSelection(**selection))
    assert client.post('/api/chat',json={'question':'Assignment 2'}).json()['grounded'] is False

def test_missing_key(monkeypatch):
    monkeypatch.delenv('OPENAI_API_KEY',raising=False)
    assert client.post('/api/chat',json={'question':'Assignment 2'}).status_code == 503
    assert client.get('/api/health').status_code == 200

@pytest.mark.parametrize('kind,status',[(openai.AuthenticationError,401),(openai.RateLimitError,429),(openai.APIStatusError,500),(openai.APITimeoutError,0)])
def test_errors(monkeypatch,kind,status):
    request=httpx.Request('POST','https://api.openai.com')
    error=kind(request=request) if not status else kind('SECRET',response=httpx.Response(status,request=request),body={})
    mocked=Mock()
    mocked.__enter__=Mock(return_value=mocked)
    mocked.__exit__=Mock(return_value=False)
    mocked.beta.chat.completions.parse.side_effect=error
    factory=Mock(return_value=mocked)
    monkeypatch.setattr(llm,'OpenAI',factory)
    monkeypatch.setenv('OPENAI_API_KEY','test-only')
    monkeypatch.setenv('OPENAI_MODEL','test-model')
    result=client.post('/api/chat',json={'question':'Assignment 2'})
    assert result.status_code == 503
    assert 'SECRET' not in result.text
    assert factory.call_args.kwargs['timeout']==20.0
    assert factory.call_args.kwargs['max_retries']==0

def test_docs():
    assert 'requestBody' in client.get('/openapi.json').json()['paths']['/api/chat']['post']

def test_adapter_success(monkeypatch):
    selection=EvidenceSelection(sufficient=True,quotes=[{'source_id':1,'quote':'Assignment 2 deadline: 2026-11-06.'}])
    mocked=Mock()
    mocked.__enter__=Mock(return_value=mocked)
    mocked.__exit__=Mock(return_value=False)
    mocked.beta.chat.completions.parse.return_value.choices=[Mock(message=Mock(parsed=selection))]
    monkeypatch.setattr(llm,'OpenAI',Mock(return_value=mocked))
    monkeypatch.setenv('OPENAI_API_KEY','test-only')
    monkeypatch.setenv('OPENAI_MODEL','configured-model')
    result=client.post('/api/chat',json={'question':'Assignment 2','course_id':1})
    assert result.status_code==200 and result.json()['grounded'] is True
    call=mocked.beta.chat.completions.parse.call_args.kwargs
    assert call['model']=='configured-model'
    assert 'Assignment 2 deadline' in call['messages'][1]['content']

def test_custom_provider_url(monkeypatch):
    monkeypatch.setenv('OPENAI_API_KEY', 'test-only')
    monkeypatch.setenv('OPENAI_MODEL', 'openai/gpt-oss-120b')
    monkeypatch.setenv('OPENAI_BASE_URL', 'https://api.groq.com/openai/v1')
    factory = Mock(side_effect=llm.ProviderUnavailable())
    monkeypatch.setattr(llm, 'OpenAI', factory)
    with pytest.raises(llm.ProviderUnavailable):
        llm.select_evidence('question', [])
    assert factory.call_args.kwargs['base_url'] == 'https://api.groq.com/openai/v1'

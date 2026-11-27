import {copy} from './strings.js';

const root = document.documentElement;
const main = document.querySelector('main');
const sheet = document.querySelector('dialog');
const workspacePreview = new URLSearchParams(location.search).get('profile') === 'workspace';
const languages = ['en','ru','kk'];
let locale = languages.includes(localStorage.scDesignLocale) ? localStorage.scDesignLocale : 'en';
let theme = localStorage.scDesignTheme === 'dark' ? 'dark' : 'light';
let state = '';
let activePane = 'chat';
let answerShown = true;
let deadlineComplete = false;
let candidateDecision = '';
const candidateExcerpt = 'Interview plan — November 30, 2026. Bring one participant profile and a draft consent script.';
const excerpt = 'Research brief — November 30, 2026. Include your research question and two interview prompts.';
const t = key => copy[key][languages.indexOf(locale)];
const keyStates = {
  courses:['ready','empty','loading','error','quota','successful'],
  course:['ready','pending','uploading','processing','duplicate','failed','deleting','empty','loading','error','successful'],
  thread:['ready','empty','loading','insufficient','provider','quota'],
  deadlines:['ready','empty','loading','error','successful'],
  settings:['ready','deleting','error','successful'],
  admin:['ready','loading','denied','unavailable','empty'],
  guest:['synthetic','simulatedLive']
};
const route = () => location.hash.slice(1) || '/';
const link = (href,key,css='') => `<a class="${css}" href="#${href}" ${route()===href?'aria-current="page"':''}>${t(key)}</a>`;
const button = (action,key,css='') => `<button class="${css}" type="button" data-action="${action}">${t(key)}</button>`;
const chip = key => `<span class="tag">${t(key)}</span>`;
const heading = (key,action='') => `<div class="row heading"><h1>${t(key)}</h1>${action}</div>`;
const status = (key, css='') => `<p role="status" class="${css}">${t(key)}</p>`;
const date = () => new Intl.DateTimeFormat(locale,{dateStyle:'medium',timeZone:'Asia/Almaty'}).format(new Date('2026-11-30T12:00:00+05:00'));
const guest = () => route().startsWith('/demo');
const coursePath = () => guest() ? '/demo/course/design-research' : '/app/courses/design-research';
const banner = () => `<p class="banner">${t(guest()?(state==='simulatedLive'?'simulatedLive':'synthetic'):'owned')}</p>`;
const pickerCopy = {synthetic: 'previewReplay', simulatedLive: 'previewSimulatedLive'};
const statePicker = screen => keyStates[screen] ? `<label class="muted">${t('state')} <select id="state">${keyStates[screen].map((key,index)=>`<option value="${index===0?'':key}" ${state===key?'selected':''}>${t(pickerCopy[key] || key)}</option>`).join('')}</select></label>` : '';
const renderState = (key,css='') => status(state || key,css);

function header() {
  const sections = route().startsWith('/app') ? [['/app/courses','courses'],['/app/deadlines','deadlines'],['/app/settings','settings'],['/app/admin','admin']] : [['/demo','demo'],['/signin','signin'],['/privacy','privacy']];
  document.querySelector('#skip').textContent = t('skip');
  document.querySelector('header').innerHTML = `<div class="bar">
    <a class="brand" href="#/"><img width="40" height="40" alt="" src="../assets/mark.svg">SmartCampus</a>
    <div class="actions"><select id="locale" aria-label="${t('language')}">${languages.map(lang=>`<option ${locale===lang?'selected':''}>${lang.toUpperCase()}</option>`).join('')}</select>${button('theme',theme==='dark'?'light':'dark')}</div>
    <nav aria-label="${t('workspace')}">${sections.map(([path,key])=>link(path,key,route()===path?'nav-current':'')).join('')}</nav>
  </div>`;
}

function landing() {
  return `<section class="hero"><div>${chip('workspace')}<h1>${t('headline')}</h1><p class="muted">${t('intro')}</p>
  <div class="actions">${link('/demo','demo','button primary')}${workspacePreview?link('/signin','google','button'):link('/signin','held','button')}</div>${link('/privacy','privacy')}</div>
  <div class="poster"><article class="card"><p class="tag">${t('scope')}</p><h2>${t('course')}</h2><p>${t('question')}</p><p class="answer">${t('answer')}</p><small>${t('citation')}</small></article>
  <article class="card"><strong>${t('brief')}</strong><p class="warm">${date()}</p></article></div></section>`;
}

function auth(screen) {
  const signIn = screen === 'signin';
  const states = workspacePreview
    ? [signIn ? 'authAvailable' : 'authLoading', 'held', 'cancelled', 'authFailed', 'expired', 'denied', ...(signIn ? ['authLoading'] : ['connected'])]
    : ['held'];
  const current = states.includes(state) ? state : states[0];
  const picker = `<label class="muted">${t('state')} <select id="state" ${states.length===1?'disabled':''}>${states.map(key=>`<option value="${key}" ${current===key?'selected':''}>${t(key)}</option>`).join('')}</select></label>`;
  const actions = {
    authAvailable: link('/auth/callback','google','button primary'),
    cancelled: button('retryAuth','retry'),
    authFailed: button('retryAuth','retry'),
    expired: button('retryAuth','retry'),
    denied: button('retryAuth','retry'),
    connected: link('/app/courses','workspace','button primary')
  };
  return `<section class="card narrow">${heading(signIn?'signin':'callback',picker)}
    <p>${t('authSimulation')}</p>${current==='authAvailable'?`<p>${t('signIntro')}</p>`:''}
    ${status(current,current==='authFailed'?'danger':'warm')}
    <div class="actions">${actions[current] || ''}${link('/demo','demo','button')}</div></section>`;
}

function courses() {
  const isGuest = guest();
  return `${banner()}${heading('courses',statePicker(isGuest?'guest':'courses'))}
    ${isGuest?link('/signin',workspacePreview?'google':'held','button'):button('courseForm','addCourse','primary')}
    <div class="two" style="margin-top:16px">${['empty','loading','error','quota'].includes(state)?`<article class="card">${renderState('empty',state==='error'?'danger':'')}${state==='error'?button('reset','retry'):''}</article>`:
    `<article class="card">${state==='successful'?status('successful'):''}<h2>${t('course')}</h2><p class="muted">1 · ${t('syllabus')}</p><p class="warm">${t('brief')} · ${date()}</p>${link(coursePath(),'openCourse','button primary')}</article>`}</div>`;
}

function documents() {
  const documentState = ['pending','uploading','processing','duplicate','failed','deleting','empty','loading','error','successful'].includes(state)?state:'ready';
  return `<section class="card stack" data-pane="documents"><h2>${t('documents')}</h2>
    ${guest()?'':button('upload','upload','primary')}
    ${documentState==='empty'?status('empty'):`<div class="item"><p><strong>${t('syllabus')}</strong></p>
      ${status(documentState,documentState==='failed'||documentState==='error'?'danger':'muted')}
      ${documentState==='uploading'?'<progress value="45" max="100" aria-label="45%"></progress>':''}
      ${['ready','duplicate','successful'].includes(documentState)?button('source','source'):''}
      ${documentState==='failed'||documentState==='error'?button('retryUpload','retry'):''}
    </div>`}
    ${guest()?'':`<h3>${t('history')}</h3>${link(coursePath()+'/chats/research-brief','question')}${button('newChat','newChat')}`}</section>`;
}

function chat() {
  const hasStatus = ['empty','loading','insufficient','provider','quota'].includes(state);
  return `<section class="card stack" data-pane="chat"><h2>${t('chat')}</h2><div>${chip('scope')}</div>
    ${answerShown&&!hasStatus?`<div class="question"><strong>${t('question')}</strong></div><div class="answer"><p>${t('answer')}</p>${button('source','citation')}</div>`:hasStatus?status(state==='empty'?'emptyChat':state,state==='provider'?'danger':'muted'):status('emptyChat','muted')}
    ${guest()?button('sample','question'):`<form class="stack" id="chat-form"><label for="question">${t('ask')}</label><input id="question" required maxlength="600"><button class="primary">${t('send')}</button></form>`}</section>`;
}

function deadlineCard() {
  return `<section class="card stack" data-pane="deadlines"><h2>${t('deadlines')}</h2>
    ${['loading','error','empty'].includes(state)?renderState('empty',state==='error'?'danger':'muted'):deadlineComplete?status('empty','muted'):`<div class="item"><small>${t('upcoming')}</small><p><strong>${t('brief')}</strong></p><time datetime="2026-11-30">${date()}</time><p>${chip('extracted')}</p>
    ${guest()?'':`<div class="actions">${button('deadlineForm','edit')}${button('complete','complete')}</div>`}</div>`}
    ${!guest()&&candidateDecision==='confirmed'?`<div class="item"><strong>${t('candidateTitle')}</strong><p>${date()}</p>${chip('extracted')}</div>`:''}</section>`;
}

function course(screen) {
  return `${banner()}${heading('course',statePicker(guest()?'guest':screen))}
    ${guest()?'':`<div class="actions" style="margin-bottom:14px">${button('courseForm','rename')}${button('deleteCourse','remove')}</div>`}
    <div class="tabs actions" aria-label="${t('course')}">${['documents','chat','deadlines'].map(key=>`<button type="button" data-pane-target="${key}" aria-pressed="${activePane===key}">${t(key)}</button>`).join('')}</div>
    <div class="columns">${documents()}${chat()}${deadlineCard()}</div>`;
}

function deadlines() {
  return `${banner()}${heading('deadlines',statePicker('deadlines'))}<div class="actions" style="margin-bottom:16px">${button('deadlineForm','addDeadline','primary')}</div>
    <div class="two">${deadlineCard()}<section class="card stack"><h2>${t('candidates')}</h2>
      <div class="item"><p>${t('candidateTitle')} · ${date()}</p>${button('candidateSource','citation')} ${candidateDecision==='confirmed'?status('successful'):candidateDecision==='rejected'?'':`${button('confirm','confirm')} ${button('reject','reject')}`}</div>
      <p class="muted">${t('undated')}</p></section>
      ${['today','overdue','completed'].map(key=>`<section class="card"><h2>${t(key)}</h2><p class="muted">${t(key==='completed'&&deadlineComplete?'brief':'empty')}</p></section>`).join('')}</div>`;
}

function settings() {
  return `${banner()}${heading('settings',statePicker('settings'))}<section class="card stack"><h2>${t('privacy')}</h2><p>${t('privacyText')}</p>
    ${state?renderState('ready',state==='error'?'danger':''):''}
    <div class="actions">${link('/privacy','privacy')}${link('/signin','logout','button')}${button('deleteAccount','deleteAccount','danger')}</div></section>`;
}

function admin() {
  return `${banner()}${heading('admin',statePicker('admin'))}
    <section class="card stack">${['denied','loading'].includes(state)?renderState('denied','warm'):`<div class="actions">
      <label>${t('from')} <input type="date" value="2026-11-25"></label><label>${t('to')} <input type="date" value="2026-11-26"></label>
      ${button('refresh','refresh')} ${button('export','export')}</div><div class="two">
      ${['accounts','activity'].map(key=>`<article class="card"><h2>${t(key)}</h2><p>${state==='unavailable'?t('unavailable'):state==='empty'?'0':'6'}</p></article>`).join('')}</div>
      <table><thead><tr><th scope="col">${t('date')}</th><th scope="col">${t('activity')}</th></tr></thead><tbody><tr><td><time datetime="2026-11-26">2026-11-26</time></td><td>${state==='unavailable'?'—':state==='empty'?'0':'6'}</td></tr></tbody></table>`}</section>`;
}

function render() {
  root.lang = locale;
  root.dataset.theme = theme;
  const path = route();
  header();
  const screen = path==='/'?landing():path==='/privacy'?`<section class="card narrow">${heading('privacy')}<p>${t('privacyText')}</p>${link('/demo','demo','button')}</section>`:
    path==='/signin'?auth('signin'):path==='/auth/callback'?auth('callback'):
    path==='/demo'||path==='/app/courses'?courses():path==='/app/deadlines'?deadlines():
    path==='/app/settings'?settings():path==='/app/admin'?admin():
    /^\/(app\/courses|demo\/course)\/[^/]+(?:\/chats\/[^/]+)?$/.test(path)?course(path.includes('/chats/')?'thread':'course'):
    `<section class="card narrow">${heading('unavailable')}${link('/','home','button')}</section>`;
  main.innerHTML = screen;
  main.querySelector(`[data-pane="${activePane}"]`)?.setAttribute('data-active','');
}

function redraw(selector) {
  render();
  document.querySelector(selector)?.focus();
}

function dialog(key,body) {
  sheet.className = 'drawer';
  sheet.innerHTML = `<h2 id="sheet-title">${t(key)}</h2>${body}<form method="dialog"><button>${t('close')}</button></form>`;
  sheet.showModal();
}

const actions = {
  theme() { theme = theme==='dark'?'light':'dark'; localStorage.scDesignTheme=theme; redraw('[data-action="theme"]'); },
  source() { dialog('source',`<p>${t('citation')} · ${t('original')}</p><blockquote lang="en">${excerpt}</blockquote>`); },
  candidateSource() { dialog('source',`<p>${t('citation')} · ${t('original')}</p><blockquote lang="en">${candidateExcerpt}</blockquote>`); },
  sample() { state=''; answerShown=true; redraw('[data-action="sample"]'); },
  newChat() { state=''; answerShown=false; redraw('#question'); },
  retryAuth() {
    if (route()==='/signin') { state='authAvailable'; redraw('main a.primary'); }
    else location.hash='/signin';
  },
  reset() { state=''; redraw('#state'); },
  upload() { state='uploading'; redraw('#state'); },
  retryUpload() { state='processing'; redraw('#state'); },
  refresh() { state='loading'; redraw('#state'); },
  export() { dialog('export',status('preview')); },
  complete() { deadlineComplete=true; redraw('#state'); },
  confirm() { candidateDecision='confirmed'; redraw('#state'); },
  reject() { candidateDecision='rejected'; redraw('#state'); },
  courseForm() { dialog('label',`<form class="stack" data-preview-form><input aria-label="${t('label')}" maxlength="80" required><button class="primary">${t('confirm')}</button></form>`); },
  deadlineForm() { dialog('addDeadline',`<form class="stack" data-preview-form><label>${t('label')} <input required></label><label>${t('date')} <input required type="date"></label><button class="primary">${t('confirm')}</button></form>`); },
  deleteAccount() { dialog('deleteAccount',`<p>${t('deletion')}</p>${button('deleting','confirm','danger')}`); },
  deleteCourse() { dialog('remove',`<p>${t('course')}</p>${button('deleting','confirm','danger')}`); },
  deleting() { sheet.close(); state='deleting'; redraw('#state'); }
};

document.querySelector('#skip').addEventListener('click',event=>{event.preventDefault(); main.focus();});

document.addEventListener('click',event => {
  const button = event.target.closest('button');
  if (button?.dataset.action) actions[button.dataset.action]?.();
  if (button?.dataset.paneTarget) {
    activePane=button.dataset.paneTarget;
    redraw(`[data-pane-target="${activePane}"]`);
  }
});
document.addEventListener('change',event => {
  if(event.target.id==='locale') {
    locale=event.target.value.toLowerCase();
    localStorage.scDesignLocale=locale;
    redraw('#locale');
  }
  if(event.target.id==='state') { state=event.target.value; redraw('#state'); }
});
document.addEventListener('submit',event => {
  if(event.target.id==='chat-form') {
    event.preventDefault();
    answerShown=true;
    state='insufficient';
    redraw('#question');
  }
  if(event.target.matches('[data-preview-form]')) {
    event.preventDefault();
    sheet.close();
    state='successful';
    redraw('#state');
  }
});
window.addEventListener('hashchange',()=>{ state=''; answerShown=true; activePane='chat'; render(); main.focus(); });
render();

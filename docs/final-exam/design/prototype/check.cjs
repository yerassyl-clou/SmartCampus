const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(path.resolve(__dirname, '../../../../frontend/node_modules/playwright'));

const base = 'http://127.0.0.1:8769/prototype/';
const evidence = path.resolve(__dirname, '../../evidence/FINAL-02');
const tracks = [
  ['landing','/'], ['signin','/signin'], ['demo','/demo'],
  ['guest-course','/demo/course/design-research'], ['courses','/app/courses'],
  ['course','/app/courses/design-research'], ['thread','/app/courses/design-research/chats/research-brief'],
  ['deadlines','/app/deadlines'], ['settings','/app/settings'], ['admin','/app/admin'],
  ['privacy','/privacy'], ['callback','/auth/callback']
];
const revision = process.env.DESIGN_TREE;
const entries = [];

async function capture(page,name) {
  const viewport=page.viewportSize();
  const id='EV-FINAL-02-'+String(entries.length+1).padStart(2,'0');
  const file=id+'-'+name+'-'+viewport.width+'.jpg';
  await page.evaluate(()=>document.activeElement.blur());
  await page.screenshot({path:path.join(evidence,file),quality:84,fullPage:true});
  entries.push({
    id, file, revision, revision_type:'git-tree of design directory',
    occurred_at:new Date(Date.now()+5*3600*1000).toISOString().replace(/Z$/, '+05:00'),
    mode:'local browser prototype', classification:'synthetic/public-safe',
    role:'design reviewer', dataset:'authored Design Research fixture', viewport,
    device:'Chromium desktop engine at fixed viewport',
    command:'DESIGN_TREE=<design-tree> node docs/final-exam/design/prototype/check.cjs',
    expected:'Render '+name+' at the declared width without horizontal overflow',
    observed:'Rendered; screenshot captured',
    access:'Repository evidence path; project academic use'
  });
}

function luminance(hex) {
  const channels=hex.slice(1).match(/../g).map(value=>parseInt(value,16)/255);
  const linear=channels.map(value=>value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4);
  return linear[0]*0.2126+linear[1]*0.7152+linear[2]*0.0722;
}

async function run() {
  const tokens=require('../tokens-v2.json');
  for(const [name,theme] of Object.entries(tokens.themes)) {
    for(const [ink,bg] of [
      ['ink','bg'],['ink','surface'],['muted','surface'],['accent','bg'],
      ['accent','tint'],['on-accent','accent'],['warm','surface'],['danger','surface']
    ]) {
      const [low,high]=[luminance(theme[ink]),luminance(theme[bg])].sort((a,b)=>a-b);
      const ratio=(high+0.05)/(low+0.05);
      assert.ok(ratio>=4.5,name+' '+ink+'/'+bg+' '+ratio);
      console.log(name+' '+ink+'/'+bg+' '+ratio.toFixed(2)+':1');
    }
  }
  const browserCopy=fs.readFileSync(path.join(__dirname,'strings.js'),'utf8');
  const {copy}=await import('data:text/javascript;base64,'+Buffer.from(browserCopy).toString('base64'));
  assert.ok(Object.values(copy).every(values=>values.length===3&&values.every(value=>value.trim())));
  console.log(Object.keys(copy).length+' nonblank EN/RU/KK key tuples');
  assert.ok(revision, 'Set DESIGN_TREE to the staged design directory tree');
  const browser=await chromium.launch();
  try {
    for(const width of [1440,375]) {
      const page=await browser.newPage({viewport:{width,height:width===1440?1000:812}});
      page.setDefaultTimeout(6000);
      const errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      const external=[];
      page.on('request',request=>{if(!request.url().startsWith(base.split('/prototype')[0])) external.push(request.url());});
      for(const [index,locale] of ['EN','RU','KK'].entries()) {
        for(const [name,screen] of tracks) {
          await page.goto(base+'?profile=workspace#'+screen);
          await page.locator('#locale').selectOption(locale);
          await page.locator('main h1').waitFor();
          assert.equal(await page.locator('html').getAttribute('lang'),locale.toLowerCase());
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' '+width+' '+locale);
          if(index===0&&['landing','guest-course','deadlines','signin'].includes(name)) await capture(page,name);
        }
      }
      await page.goto(base+'?profile=workspace#/demo');
      await page.locator('#locale').selectOption('EN');
      await page.locator('#skip').press('Enter');
      assert.equal(await page.locator('main').evaluate(node=>document.activeElement===node),true);
      await page.getByRole('link',{name:'Open course'}).click();
      const citation=page.getByRole('button',{name:'1 · Syllabus, section 3'});
      await citation.focus();
      await page.keyboard.press('Enter');
      assert.match(await page.getByRole('dialog').innerText(),/November 30, 2026/);
      await page.keyboard.press('Escape');
      assert.equal(await citation.evaluate(node=>document.activeElement===node),true);
      await page.getByRole('button',{name:'Dark',exact:true}).click();
      assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
      if(width===375) {
        await page.getByRole('button',{name:'Documents',exact:true}).click();
        assert.equal(await page.getByRole('heading',{name:'Documents'}).isVisible(),true);
        await capture(page,'guest-source-tab-dark');
      }
      if(width===1440) await capture(page,'guest-course-dark');
      await page.goto(base+'?profile=workspace#/demo');
      await page.getByRole('link',{name:'Continue with Google'}).click();
      await page.getByRole('link',{name:'Continue with Google'}).click();
      await page.locator('#state').selectOption('cancelled');
      assert.match(await page.getByRole('status').innerText(),/cancelled/);
      await page.locator('#state').selectOption('connected');
      await page.getByRole('link',{name:'Study workspace'}).press('Enter');
      await page.locator('#state').selectOption('empty');
      assert.match(await page.getByRole('status').innerText(),/Nothing here yet/);
      await page.locator('#state').selectOption('error');
      await page.getByRole('button',{name:'Retry'}).click();
      await page.getByRole('link',{name:'Open course'}).click();
      if(width===375) await page.getByRole('button',{name:'Documents',exact:true}).click();
      await page.getByRole('button',{name:'Upload PDF or DOCX'}).click();
      assert.equal(await page.getByRole('progressbar').getAttribute('value'),'45');
      await page.locator('#state').selectOption('failed');
      await page.getByRole('button',{name:'Retry'}).click();
      assert.equal(await page.getByText('Processing',{exact:true}).last().isVisible(),true);
      await page.goto(base+'#/app/deadlines');
      await page.getByRole('button',{name:'1 · Syllabus, section 3'}).click();
      assert.match(await page.getByRole('dialog').innerText(),/Interview plan/);
      await page.keyboard.press('Escape');
      await page.getByRole('button',{name:'Confirm',exact:true}).click();
      assert.match(await page.getByRole('status').innerText(),/Saved/);
      await page.goto(base+'#/signin');
      assert.equal(await page.getByRole('link',{name:'Continue with Google'}).count(),0);
      await page.goto(base+'#/demo');
      await page.getByRole('link',{name:'Open course'}).click();
      assert.equal(await page.getByRole('button',{name:'Upload PDF or DOCX'}).count(),0);
      assert.deepEqual(external,[]);
      assert.deepEqual(errors,[]);
      console.log(width+'px: 36 route/locale renders, theme, keyboard citation, auth hold/cancel, upload retry, candidate and isolation passed');
      await page.close();
    }
    fs.writeFileSync(path.join(evidence,'captures.json'),JSON.stringify(entries,null,2)+'\n');
  } finally {
    await browser.close();
  }
}

run().catch(error=>{console.error(error);process.exitCode=1;});

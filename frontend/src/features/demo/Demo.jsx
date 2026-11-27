import React, { useState } from 'react'
import { Action, Card, SourceDialog } from '../../app/components.jsx'
import { authConfig } from '../auth/WorkspaceAuth.jsx'
import {
  formatDemoDate, readSyntheticCourse, replaySyntheticAnswer, researchBriefPrompt, sampleCourseSlug,
} from './syntheticReplay.js'

function DeadlineCard({ course, locale, t, ...props }) {
  return <Card {...props}>
    <h2>{t('deadlineDashboard')}</h2>
    <ul className="sc-list">
      {course.deadlines.map(item=><li key={item.date}>
        <strong>{item.title[locale]}</strong>
        <time dateTime={item.date}>{formatDemoDate(item.date,locale)}</time>
        <span className="sc-tag">{t('extracted')}</span>
      </li>)}
    </ul>
  </Card>
}

function GuestBanner({ t }) {
  return <p className="sc-banner">{t('synthetic')}</p>
}

export function DemoHome({ locale, t }) {
  const course = readSyntheticCourse(sampleCourseSlug)
  return <>
    <GuestBanner t={t} />
    <div className="sc-heading">
      <div><h1>{t('courses')}</h1><p className="sc-muted">{t('guestIntro')}</p></div>
      <Action href="/signin">{t(authConfig ? 'google' : 'uiHold')}</Action>
    </div>
    <div className="sc-two">
      <Card>
        <h2>{course.title[locale]}</h2>
        <p className="sc-muted">{t('syllabus')}</p>
        <Action href={'/demo/course/'+course.slug} primary>{t('openCourse')}</Action>
      </Card>
      <DeadlineCard course={course} locale={locale} t={t} />
    </div>
    <p className="sc-muted sc-footer">{t('guestReadOnly')}</p>
  </>
}

export function DemoCourse({ slug, locale, t }) {
  const [view,setView] = useState('chat')
  const [prompt,setPrompt] = useState(null)
  const course = readSyntheticCourse(slug)
  if (!course) return <>
    <GuestBanner t={t} />
    <Card narrow>
      <h1>{t('unknownCourse')}</h1>
      <Action href="/demo">{t('backCourses')}</Action>
    </Card>
  </>
  const reply = replaySyntheticAnswer(slug,prompt,locale)
  return <>
    <GuestBanner t={t} />
    <div className="sc-heading">
      <div><a href="/demo">{t('backCourses')}</a><h1>{course.title[locale]}</h1></div>
    </div>
    <div className="sc-tabs sc-actions" role="group" aria-label={t('course')}>
      {['documents','chat','deadlines'].map(id=>
        <Action key={id} aria-pressed={view===id} aria-controls={'pane-'+id}
          onClick={()=>setView(id)}>{t(id)}</Action>)}
    </div>
    <div className="sc-course-grid">
      <Card id="pane-documents" data-active={view==='documents'}>
        <h2>{t('documents')}</h2>
        <p>{t('syllabus')}</p>
        <SourceDialog source={course.syllabus} label={t('source')} t={t} />
      </Card>
      <Card id="pane-chat" data-active={view==='chat'}>
        <h2>{t('chat')}</h2>
        <p><span className="sc-tag">{t('scope')}</span></p>
        <div className="sc-question">
          <small>{t('exampleQuestion')}</small><p>{t('question')}</p>
          <Action onClick={()=>setPrompt(researchBriefPrompt)}>{t('samplePrompt')}</Action>
        </div>
        <div role="status" className={reply ? 'sc-answer' : 'sc-muted'}>
          {reply ? <>
            <p>{reply.text}</p>
            <SourceDialog source={reply.source} label={t('citation')} t={t} />
          </> : <p>{t('replayHint')}</p>}
        </div>
      </Card>
      <DeadlineCard id="pane-deadlines" data-active={view==='deadlines'}
        course={course} locale={locale} t={t} />
    </div>
  </>
}

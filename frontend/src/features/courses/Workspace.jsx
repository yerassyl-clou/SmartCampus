import React, {useEffect, useRef, useState} from 'react'
import {Action, Card} from '../../app/components.jsx'
import Documents from '../documents/Documents.jsx'
import WorkspaceDeadlines from '../deadlines/WorkspaceDeadlines.jsx'
import {almatyDay, deleteFixtureCourse, limits, readWorkspace, saveWorkspace} from './fixtureWorkspace.js'
import {formatDemoDate} from '../demo/syntheticReplay.js'
import {workspaceTranslator} from './workspaceCopy.js'
import WorkspaceDialog from './WorkspaceDialog.jsx'
import './workspace.css'

export function allowLocalWorkspaceFixture(config, env, origin) {
  return env.DEV && env.VITE_WORKSPACE_FIXTURE === 'true' &&
    config?.key === 'sb_publishable_browser_test_fixture' &&
    config.authOrigin === origin && !config.apiOrigin &&
    ['127.0.0.1', 'localhost', '[::1]'].includes(new URL(origin).hostname)
}

export default function Workspace({route, owner, locale, translate, signOut}) {
  const t = workspaceTranslator(locale, translate)
  const [workspace, setWorkspace] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [notice, setNotice] = useState('')
  const [problem, setProblem] = useState('')
  const [spec, setSpec] = useState(null)
  const current = useRef(null)
  const heading = useRef(null)
  useEffect(() => {
    try {
      current.current = readWorkspace(owner)
      setWorkspace(current.current)
      setLoadError(false)
    } catch {
      setLoadError(true)
    }
  }, [owner, attempt])

  function commit(update, message = 'saved') {
    try {
      const next = update(current.current)
      saveWorkspace(owner,next)
      current.current = next
      setWorkspace(next)
      setProblem('')
      setNotice(message)
      return null
    } catch {
      setNotice('')
      setProblem('storageError')
      return 'storageError'
    }
  }

  function open(event, modal) {
    setSpec({...modal, trigger:event.currentTarget})
  }

  function showSource(event,id) {
    const row = current.current.documents.find(document => document.id === id)
    if (!row) {
      setNotice('')
      setProblem('sourceGone')
      return
    }
    open(event, {title:t('source'), source:row})
  }

  function editCourse(event, course) {
    open(event, {title:t(course ? 'rename' : 'newCourse'),
      fields:[{name:'name', label:t('courseName'), value:course?.name}],
      submit:form => {
        const name = form.get('name').trim().normalize('NFC')
        if (![...name].length || [...name].length > 80) return 'invalidName'
        if (!course && current.current.courses.length >= limits.courses) return 'courseLimit'
        const row = {id:course?.id ?? crypto.randomUUID(), name}
        return commit(data => ({...data, courses:course
          ? data.courses.map(item => item.id === row.id ? row : item) : [...data.courses,row]}))
      },
    })
  }

  const course = workspace?.courses.find(row => row.id === route.params.id)
  const title = route.id === 'course' ? course?.name ?? t('missingCourse') : t(route.id)
  const deadlineProps = {workspace, commit, open, showSource, locale, t}
  const headingText = !workspace && route.id === 'course' ? t('course') : title
  return <div className="sc-workspace">
    <p className="sc-banner">{t('fixture')}</p>
    <div className="sc-heading">
      <div>
        {route.id === 'course' && <a href="/app/courses">{t('courses')}</a>}
        <h1 ref={heading} tabIndex="-1">{headingText}</h1>
      </div>
      <div className="sc-actions">
        {route.id === 'courses' && workspace && <Action primary disabled={workspace.courses.length >= limits.courses}
          onClick={event => editCourse(event)}>{t('newCourse')}</Action>}
        {course && <>
          <Action onClick={event => editCourse(event, course)}>{t('rename')}</Action>
          <Action onClick={event => open(event, {title:t('deleteCourse'), text:t('confirmCourse'),
            action:t('deleteCourse'), submit:() => commit(data => deleteFixtureCourse(data,course.id),'removed')})}>
            {t('deleteCourse')}
          </Action>
        </>}
        <Action onClick={signOut}>{t('logout')}</Action>
      </div>
    </div>
    {notice && <p role="status">{t(notice)}</p>}
    {problem && !spec && <p role="alert" className="sc-error">{t(problem)}</p>}
    {!workspace && <Card>
      <p role={loadError ? 'alert' : 'status'}>{t(loadError ? 'loadError' : 'authChecking')}</p>
      {loadError && <Action onClick={() => setAttempt(attempt+1)}>{t('retry')}</Action>}
    </Card>}
    {workspace && route.id === 'courses' && <>
      {!workspace.courses.length && <Card><p>{t('emptyCourses')}</p></Card>}
      {workspace.courses.length >= limits.courses && <p>{t('courseLimit')}</p>}
      <div className="sc-two">
        {workspace.courses.map(row => {
          const count = workspace.documents.filter(doc => doc.course_id === row.id).length
          const today = almatyDay()
          const next = workspace.deadlines.filter(item =>
            item.course_id === row.id && !item.completed && item.due_on >= today)
            .sort((a,b) => a.due_on.localeCompare(b.due_on))[0]
          return <Card key={row.id}>
            <h2><a href={'/app/courses/'+row.id}>{row.name}</a></h2>
            <p className="sc-muted">{t('documents')} · {count}</p>
            {next && <p>{t('upcoming')} · <time dateTime={next.due_on}>{formatDemoDate(next.due_on,locale)}</time></p>}
          </Card>
        })}
      </div>
    </>}
    {workspace && route.id === 'course' && (course ? <>
      <nav aria-label={t('course')} className="sc-actions sc-work-links">
        <Action href="#documents">{t('documents')}</Action>
        <Action href="#deadlines">{t('deadlines')}</Action>
      </nav>
      <div className="sc-two">
        <Documents course={course} rows={workspace.documents.filter(row => row.course_id === course.id)}
          commit={commit} open={open} showSource={showSource} t={t}/>
        <WorkspaceDeadlines {...deadlineProps} courseId={course.id}/>
      </div>
    </> : <Card><Action href="/app/courses">{t('courses')}</Action></Card>)}
    {workspace && route.id === 'deadlines' && <WorkspaceDeadlines {...deadlineProps}/>}
    {spec && <WorkspaceDialog spec={spec} dismiss={() => setSpec(null)} t={t} fallbackFocus={heading}/>}
  </div>
}

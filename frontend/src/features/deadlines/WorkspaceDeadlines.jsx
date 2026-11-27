import React, {useEffect, useState} from 'react'
import {Action, Card} from '../../app/components.jsx'
import {formatDemoDate} from '../demo/syntheticReplay.js'
import {almatyDay, deadlineStatus} from '../courses/fixtureWorkspace.js'

const groups = ['overdue','today','upcoming','completed']
function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return false
  const date = new Date(value + 'T00:00:00Z')
  return Number.isFinite(+date) && date.toISOString().slice(0,10) === value
}

export default function WorkspaceDeadlines({workspace, courseId, commit, open, showSource, locale, t}) {
  const [today, setToday] = useState(almatyDay)
  useEffect(() => {
    const update = () => setToday(almatyDay())
    const id = setInterval(update, 1000)
    window.addEventListener('focus', update)
    return () => {
      clearInterval(id)
      window.removeEventListener('focus', update)
    }
  }, [])
  const courses = workspace.courses.filter(row => !courseId || row.id === courseId)
  const scope = row => courses.some(course => course.id === row.course_id)
  const deadlines = workspace.deadlines.filter(scope).sort((a,b) => a.due_on.localeCompare(b.due_on))
  const candidates = workspace.candidates.filter(scope)
  const courseName = id => courses.find(course => course.id === id)?.name

  function edit(event, row, candidate = false) {
    const fields = [
      {name:'title', label:t('title'), value:row?.title},
      {name:'due_on', label:t('date'), type:'date', value:row?.due_on},
    ]
    if (!courseId && !row) fields.unshift({name:'course_id', label:t('courseName'), options:courses})
    open(event, {
      title:t(candidate ? 'confirm' : row ? 'editDeadline' : 'newDeadline'), fields,
      submit:form => {
        const title = form.get('title').trim()
        const due_on = form.get('due_on')
        const id = row && !candidate ? row.id : crypto.randomUUID()
        const course_id = row?.course_id ?? courseId ?? form.get('course_id')
        if (!title || !validDate(due_on) || !courseName(course_id)) return 'invalidDeadline'
        const entry = {...row, id, title, due_on, course_id,
          origin:candidate ? 'extracted' : row?.origin ?? 'manual', completed:row?.completed ?? false}
        return commit(data => ({
          ...data,
          deadlines: row && !candidate ? data.deadlines.map(item => item.id === id ? entry : item)
            : [...data.deadlines, entry],
          candidates: candidate ? data.candidates.filter(item => item.id !== row.id) : data.candidates,
        }))
      },
    })
  }

  const dateLabel = date => <time dateTime={date}>{formatDemoDate(date, locale)}</time>
  return <Card className="sc-work-pane" id="deadlines">
    {courseId && <h2>{t('deadlines')}</h2>}
    <Action primary disabled={!courses.length} onClick={event => edit(event)}>{t('newDeadline')}</Action>
    {!deadlines.length && <p className="sc-work-result sc-muted">{t('emptyDeadlines')}</p>}
    {groups.map(group => {
      const rows = deadlines.filter(row => deadlineStatus(row,today) === group)
      return rows.length > 0 && <section key={group} className="sc-work-result">
        <h3>{t(group)}</h3>
        <ul className="sc-work-list">
          {rows.map(row => <li key={row.id}>
            <strong>{row.title}</strong>
            <p className="sc-muted">{dateLabel(row.due_on)} · {courseName(row.course_id)}</p>
            <p><span className="sc-tag">{t(row.origin)}</span></p>
            <div className="sc-actions">
              <Action id={'deadline-status-'+row.id} onClick={() => {
                const error = commit(data => ({...data, deadlines:data.deadlines.map(item =>
                  item.id === row.id ? {...item, completed:!item.completed} : item)}))
                if (!error) requestAnimationFrame(() => document.getElementById('deadline-status-'+row.id)?.focus())
              }}>
                {t(row.completed ? 'reopen' : 'complete')}
              </Action>
              <Action onClick={event => edit(event,row)}>{t('editDeadline')}</Action>
              {row.document_id && <Action onClick={event => showSource(event,row.document_id)}>{t('source')}</Action>}
              <Action onClick={event => open(event, {title:t('deleteDeadline'), text:t('confirmDeadline'),
                action:t('deleteDeadline'), submit:() => commit(data =>
                  ({...data, deadlines:data.deadlines.filter(item => item.id !== row.id)}), 'removed')})}>
                {t('deleteDeadline')}
              </Action>
            </div>
          </li>)}
        </ul>
      </section>
    })}
    {candidates.length > 0 && <section className="sc-work-result">
      <h3>{t('suggestions')}</h3>
      <ul className="sc-work-list">
        {candidates.map(row => <li key={row.id}>
          <strong>{row.title}</strong> <span className="sc-tag">{t('suggestion')}</span>
          <p className="sc-muted">{row.due_on ? dateLabel(row.due_on) : row.relative} · {courseName(row.course_id)}</p>
          {!row.due_on && <p>{t('relative')}</p>}
          <div className="sc-actions">
            <Action onClick={event => showSource(event,row.document_id)}>{t('source')}</Action>
            <Action disabled={!row.due_on} onClick={event => edit(event,row,true)}>{t('confirm')}</Action>
            <Action onClick={event => {
              const error = commit(data => ({...data, candidates:data.candidates.filter(item => item.id !== row.id)}), 'rejected')
              if (!error) event.currentTarget.closest('.sc-work-pane').querySelector('button')?.focus()
            }}>{t('reject')}</Action>
          </div>
        </li>)}
      </ul>
    </section>}
  </Card>
}

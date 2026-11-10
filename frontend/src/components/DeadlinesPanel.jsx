import React, { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { campusCalendarDate, formatDeadlineDate, requestDeadlines } from '../lib/deadlines.js'

function DeadlineGroup({ label, items }) {
  return (
    <section className="deadline-group" aria-label={label}>
      <h3>{label}</h3>
      {items.length === 0 ? <p className="deadlines-count">No upcoming deadlines.</p> : (
        <>
          <p className="deadlines-count">{items.length} {items.length === 1 ? 'deadline' : 'deadlines'} <span aria-hidden="true">·</span> Earliest first</p>
          <ul className="deadline-list" aria-label={label}>
            {items.map((item) => (
              <li className="deadline-card" key={item.id}>
                <p className="deadline-course">{item.course_name}</p>
                <h4>{item.title}</h4>
                <p className="deadline-date"><Icon name="clock" size={15} /><span className="sr-only">Due </span><time dateTime={item.due_date}>{formatDeadlineDate(item.due_date)}</time></p>
                <p className="deadline-source"><Icon name="source" size={15} /><span><span className="sr-only">Source: </span>{item.source_title}</span></p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export default function DeadlinesPanel() {
  const [items, setItems] = useState(null)
  const [pending, setPending] = useState(true)
  const [error, setError] = useState(null)
  const requestRef = useRef(null)

  const load = useCallback(async () => {
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    setPending(true)
    setError(null)
    const timeout = setTimeout(() => controller.abort('timeout'), 15000)
    try {
      const deadlines = await requestDeadlines({ signal: controller.signal })
      if (!controller.signal.aborted && requestRef.current === controller) setItems(deadlines)
    } catch (failure) {
      if (requestRef.current === controller &&
          (!controller.signal.aborted || controller.signal.reason === 'timeout')) {
        setError(controller.signal.reason === 'timeout'
          ? 'Loading deadlines took too long. Please try again.'
          : failure.message)
      }
    } finally {
      clearTimeout(timeout)
      if (requestRef.current === controller &&
          (!controller.signal.aborted || controller.signal.reason === 'timeout')) {
        requestRef.current = null
        setPending(false)
      }
    }
  }, [])

  useEffect(() => {
    load()
    return () => requestRef.current?.abort()
  }, [load])

  const today = campusCalendarDate()
  const upcoming = items?.filter(item => item.due_date >= today)
  const past = items?.filter(item => item.due_date < today)

  return (
    <section className="deadlines-panel" id="upcoming-deadlines" aria-labelledby="deadlines-title" tabIndex={-1}>
      <header className="deadlines-header">
        <div className="deadlines-heading">
          <span className="assistant-mark"><Icon name="clock" size={21} /></span>
          <div>
            <p className="eyebrow">Plan your next step</p>
            <h2 id="deadlines-title">Course deadlines</h2>
          </div>
        </div>
        <button className="refresh-button" type="button" onClick={load} disabled={pending} aria-label="Refresh deadlines">
          <Icon name="retry" size={16} /> Refresh
        </button>
      </header>
      <p className="deadlines-description">A clearer view of what’s due, from your fictional course materials.</p>
      {pending && <p className="deadlines-status" role="status">Loading deadlines…</p>}
      <div aria-busy={pending}>
        {error && (
          <div className="error-message deadline-error" role="alert">
            <Icon name="alert" size={20} />
            <div>
              <strong>We couldn’t load deadlines</strong>
              <p>{error}</p>
              {items !== null && <p>Showing the last loaded deadlines. Refresh to check for changes.</p>}
              <button className="retry-button" type="button" onClick={load} disabled={pending} aria-label="Retry deadlines">
                <Icon name="retry" size={15} /> Retry
              </button>
            </div>
          </div>
        )}
        {items !== null && items.length === 0 && !pending && !error && (
          <div className="deadlines-empty">
            <span className="assistant-mark"><Icon name="checklist" size={23} /></span>
            <h3>No deadlines to show</h3>
            <p>There are no deadlines in the available course materials. Refresh to check for updates.</p>
          </div>
        )}
        {items?.length > 0 && (
          <>
            <DeadlineGroup label="Upcoming deadlines" items={upcoming} />
            {past.length > 0 && <DeadlineGroup label="Past deadlines" items={past} />}
          </>
        )}
      </div>
    </section>
  )
}

import React, { useEffect, useId, useRef, useState } from 'react'
import { requestFeedback } from '../lib/feedback.js'

const categories = [
  ['incorrect_information', 'Incorrect information'],
  ['outdated_information', 'Outdated information'],
  ['missing_information', 'Missing information'],
  ['other', 'Other'],
]
const commentLimit = 500

export default function AnswerFeedback({ responseId, sourceIds }) {
  const formId = useId()
  const [editing, setEditing] = useState(false)
  const [category, setCategory] = useState('')
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const requestRef = useRef(null)
  const openerRef = useRef(null)
  const categoryRef = useRef(null)
  const lastRating = useRef(null)
  const length = Array.from(comment).length
  const pending = status === 'pending'
  const complete = status === 'saved' || status === 'already_submitted'

  useEffect(() => () => {
    requestRef.current?.abort()
    requestRef.current = null
  }, [])

  useEffect(() => {
    if (editing) categoryRef.current?.focus()
  }, [editing])

  function cancel() {
    setEditing(false)
    setCategory('')
    setComment('')
    setStatus('idle')
    setError('')
    openerRef.current?.focus()
  }

  async function send(rating) {
    if (complete || requestRef.current) return
    if (rating === 'not_helpful' && (!category || length > commentLimit)) {
      setError(!category ? 'Choose an issue category.' : 'Use 500 characters or fewer.')
      return
    }

    const controller = new AbortController()
    requestRef.current = controller
    lastRating.current = rating
    setError('')
    setStatus('pending')
    const timeout = setTimeout(() => controller.abort('timeout'), 15000)
    try {
      const result = await requestFeedback({
        response_id: responseId,
        rating,
        ...(rating === 'not_helpful' ? { issue_type: category, comment: comment || null } : {}),
        source_ids: sourceIds,
      }, { signal: controller.signal })
      if (requestRef.current === controller && !controller.signal.aborted) {
        setStatus(result)
        setEditing(false)
      }
    } catch (failure) {
      if (requestRef.current === controller) {
        setStatus('error')
        setError(controller.signal.reason === 'timeout'
          ? 'Sending feedback took too long. Please try again.'
          : failure.message)
      }
    } finally {
      clearTimeout(timeout)
      if (requestRef.current === controller) requestRef.current = null
    }
  }

  return (
    <section className="answer-feedback" aria-label="Answer feedback">
      <p>Was this answer helpful?</p>
      <div className="feedback-actions">
        <button type="button" disabled={editing || pending || complete} onClick={() => send('helpful')}>Helpful</button>
        <button type="button" ref={openerRef} disabled={pending || complete} aria-expanded={editing}
          aria-controls={editing ? formId : undefined} onClick={() => {
            setStatus('idle')
            setError('')
            setEditing(true)
          }}>Not helpful</button>
      </div>
      {editing && (
        <form id={formId} onSubmit={(event) => { event.preventDefault(); send('not_helpful') }}>
          <label htmlFor={formId + '-category'}>Issue category</label>
          <select id={formId + '-category'} ref={categoryRef} required value={category} disabled={pending}
            onChange={(event) => setCategory(event.target.value)}>
            <option value="">Choose a category</option>
            {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <label htmlFor={formId + '-comment'}>Comment (optional)</label>
          <textarea id={formId + '-comment'} value={comment} rows={2} disabled={pending}
            aria-describedby={formId + '-hint'} aria-invalid={length > commentLimit}
            onChange={(event) => setComment(event.target.value)} />
          <p id={formId + '-hint'}>{length}/{commentLimit} characters. Leave out personal information.</p>
          <div className="feedback-actions">
            <button type="submit" disabled={pending || length > commentLimit}>Send feedback</button>
            <button type="button" disabled={pending} onClick={cancel}>Cancel</button>
          </div>
          {length > commentLimit && <p role="alert">Use 500 characters or fewer.</p>}
        </form>
      )}
      {pending && <p role="status">Sending feedback…</p>}
      {status === 'saved' && <p role="status">Feedback saved. Thank you.</p>}
      {status === 'already_submitted' && <p role="status">Feedback was already submitted for this answer.</p>}
      {error && <p role="alert">{error}</p>}
      {status === 'error' && lastRating.current === 'helpful' && !editing && (
        <button type="button" onClick={() => send('helpful')}>Retry feedback</button>
      )}
    </section>
  )
}

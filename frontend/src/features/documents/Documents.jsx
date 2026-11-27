import React, {useEffect, useRef, useState} from 'react'
import {Action, Card} from '../../app/components.jsx'
import {deleteFixtureDocument, limits} from '../courses/fixtureWorkspace.js'
import {uploadFixture, validateFile} from './fixtureUpload.js'

export default function Documents({course, rows, commit, open, showSource, t}) {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [state, setState] = useState('')
  const transfer = useRef(null)
  const controller = useRef(null)
  const input = useRef(null)
  const cancel = useRef(null)
  const upload = useRef(null)
  const busy = state === 'uploading' || state === 'processing'

  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => {
    if (state === 'uploading') cancel.current?.focus()
  }, [state])

  function choose(event) {
    const next = event.target.files[0]
    const error = next ? validateFile(next) : null
    transfer.current = error || !next ? null : {file:next, offset:0}
    setFile(transfer.current?.file ?? null)
    setState(error ?? '')
    setProgress(0)
  }

  async function start() {
    if (!transfer.current || controller.current || rows.length >= limits.documents) return
    const run = new AbortController()
    controller.current = run
    let saved = false
    setState('uploading')
    try {
      const result = await uploadFixture(transfer.current, {
        signal: run.signal, onProgress: setProgress, onProcessing: () => setState('processing'),
      })
      if (result.reason) {
        setProgress(transfer.current.offset)
        setState(result.reason)
      } else if (rows.some(row => row.hash === result.hash)) {
        setState('duplicate')
      } else {
        const entry = {id:crypto.randomUUID(), course_id:course.id, name:file.name,
          bytes:file.size, hash:result.hash, status:'ready'}
        const error = commit(workspace => ({...workspace, documents:[...workspace.documents, entry]}))
        if (error) setState(error)
        else {
          transfer.current = null
          input.current.value = ''
          setFile(null)
          setState('ready')
          saved = true
        }
      }
    } catch {
      if (input.current) setState(run.signal.aborted ? 'cancelled' : 'uploadError')
    } finally {
      controller.current = null
      if (cancel.current === document.activeElement) {
        requestAnimationFrame(() => (saved ? input : upload).current?.focus())
      }
    }
  }

  function stop() {
    controller.current?.abort()
  }

  return <Card className="sc-work-pane" id="documents">
    <h2>{t('documents')}</h2>
    <div className="sc-work-file">
      <label className="sc-action">
        {t('choose')}
        <input ref={input} type="file" accept=".pdf,.docx" onChange={choose}
          disabled={busy || rows.length >= limits.documents}/>
      </label>
      {file && <span className="sc-muted">{file.name}</span>}
    </div>
    <p className="sc-muted">{t(rows.length >= limits.documents ? 'documentLimit' : 'formats')}</p>
    <div className="sc-actions">
      <button ref={upload} type="button" className="sc-action sc-primary"
        disabled={!file || busy || ['corrupt','scanned','encrypted','duplicate'].includes(state) || rows.length >= limits.documents}
        onClick={start}>{t(file && state && !busy ? 'retry' : 'upload')}</button>
      {busy && <button ref={cancel} type="button" className="sc-action" onClick={stop}>{t('cancel')}</button>}
    </div>
    {file && (busy || progress > 0) && <progress aria-label={t('uploading')} value={progress} max={file.size}/>}
    {state && <p className="sc-work-result" role="status">{t(state)}</p>}
    {rows.length === 0 && <p className="sc-work-result sc-muted">{t('emptyDocs')}</p>}
    <ul className="sc-work-list">
      {rows.map(row => <li key={row.id}>
        <strong>{row.name}</strong> <span className="sc-tag">{t(row.status)}</span>
        <div className="sc-actions">
          <Action onClick={event => showSource(event, row.id)}>{t('source')}</Action>
          <Action onClick={event => open(event, {
            title:t('deleteDoc'), text:t('confirmDoc'), action:t('deleteDoc'),
            submit:() => commit(workspace => deleteFixtureDocument(workspace, row.id), 'removed'),
          })}>{t('deleteDoc')}</Action>
        </div>
      </li>)}
    </ul>
  </Card>
}

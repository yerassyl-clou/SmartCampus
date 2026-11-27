import React, {useEffect, useId, useRef, useState} from 'react'
import {Action} from '../../app/components.jsx'

export default function WorkspaceDialog({spec, dismiss, t, fallbackFocus}) {
  const dialog = useRef(null)
  const title = useId()
  const [error, setError] = useState('')
  useEffect(() => {
    const element = dialog.current
    element.showModal()
    return () => {
      element.close()
      requestAnimationFrame(() => {
        const target = spec.trigger?.isConnected && !spec.trigger.disabled ? spec.trigger : fallbackFocus.current
        target?.focus()
      })
    }
  }, [spec, fallbackFocus])

  function submit(event) {
    event.preventDefault()
    const problem = spec.submit(new FormData(event.currentTarget))
    if (problem) setError(problem)
    else dismiss()
  }

  return <dialog ref={dialog} className={'sc-dialog' + (spec.source ? ' sc-source-drawer' : '')}
    aria-labelledby={title} onCancel={event => { event.preventDefault(); dismiss() }}>
    <h2 id={title}>{spec.title}</h2>
    {spec.text && <p>{spec.text}</p>}
    {spec.source ? <>
      <p className="sc-muted">{spec.source.name} · {t(spec.source.status)}</p>
      {spec.source.excerpt ? <blockquote lang="en">{spec.source.excerpt}</blockquote> : <p>{t('noExcerpt')}</p>}
      <Action autoFocus onClick={dismiss}>{t('close')}</Action>
    </> : <form className="sc-work-form" onSubmit={submit}>
      {spec.fields?.map((field, index) => <label key={field.name}>
        {field.label}
        {field.options ? <select name={field.name} defaultValue={field.value} autoFocus={index === 0} required>
          {field.options.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
        </select> : <input name={field.name} type={field.type ?? 'text'} defaultValue={field.value}
          autoFocus={index === 0} required aria-invalid={error ? true : undefined}/>}
      </label>)}
      {error && <p role="alert" className="sc-error">{t(error)}</p>}
      <div className="sc-actions">
        <Action autoFocus={!spec.fields?.length} onClick={dismiss}>{t('cancel')}</Action>
        <button className="sc-action sc-primary" type="submit">{spec.action ?? t('save')}</button>
      </div>
    </form>}
  </dialog>
}

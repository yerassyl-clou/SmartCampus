import React, { useRef } from 'react'

export function Action({ href, primary, children, ...props }) {
  const className = 'sc-action' + (primary ? ' sc-primary' : '')
  return href
    ? <a className={className} href={href} {...props}>{children}</a>
    : <button type="button" className={className} {...props}>{children}</button>
}

export function Card({ children, narrow, className = '', ...props }) {
  return <section className={`sc-card ${narrow ? 'sc-narrow' : ''} ${className}`} {...props}>{children}</section>
}

export function SourceDialog({ source, label, t }) {
  const dialog = useRef(null)
  const trigger = useRef(null)
  return <>
    <Action onClick={event=>{
      trigger.current = event.currentTarget
      dialog.current.showModal()
    }}>{label}</Action>
    <dialog className="sc-dialog" ref={dialog} aria-label={t('source')}
      onClose={()=>trigger.current?.focus()}>
      <h2>{t('source')}</h2>
      <p>{t('sourceExample')}</p>
      <p className="sc-muted">{t('original')}</p>
      <blockquote lang={source.originalLanguage}>{source.excerpt}</blockquote>
      <form method="dialog"><button className="sc-action">{t('close')}</button></form>
    </dialog>
  </>
}

import React, { useEffect, useRef, useState } from 'react'
import { isMockChat, requestChat } from '../lib/chat.js'
import Icon from './Icon.jsx'

const suggestions = [
  {
    icon: 'clock',
    label: 'Stay ahead of deadlines',
    question: 'When is my next Database Systems assignment due?',
  },
  {
    icon: 'checklist',
    label: 'Make sense of coursework',
    question: 'What are the project requirements?',
  },
  {
    icon: 'book',
    label: 'Find the right information',
    question: 'Where can I find information about course deadlines?',
  },
]

function Welcome({ onSuggestion }) {
  return (
    <div className="welcome">
      <div className="welcome-symbol">
        <Icon name="campus" size={36} />
        <span>
          <Icon name="sparkle" size={16} />
        </span>
      </div>
      <p className="eyebrow">Hello, curious mind</p>
      <h3>
        A little clarity for
        <br />
        your campus day.
      </h3>
      <p className="welcome-description">
        From assignment deadlines to course requirements,
        <br className="desktop-break" /> let’s find the information you need.
      </p>
      <div className="suggestions" aria-label="Suggested questions">
        {suggestions.map(({ icon, label, question }) => (
          <button
            key={question}
            className="suggestion"
            type="button"
            onClick={() => onSuggestion(question)}
          >
            <Icon name={icon} size={21} />
            <span className="suggestion-label">{label}</span>
            <span className="suggestion-question">{question}</span>
            <Icon name="arrow" size={17} className="suggestion-arrow" />
          </button>
        ))}
      </div>
      <span className="welcome-note">
        <Icon name="source" size={14} /> Answers with context. Sources you can
        check.
      </span>
    </div>
  )
}

function Message({ message }) {
  const assistant = message.role === 'assistant'
  return (
    <article
      className={`message message-${message.role}`}
      aria-label={assistant ? 'SmartCampus response' : 'Your question'}
    >
      <span className={`message-avatar ${assistant ? 'assistant-avatar' : ''}`}>
        <span className="sr-only">{assistant ? 'SmartCampus' : 'Student'}</span>
        {assistant ? <Icon name="sparkle" size={18} /> : 'You'}
      </span>
      <div className="message-content">
        <div className="message-label">
          {assistant ? 'SmartCampus' : 'You'}
          {assistant && isMockChat && (
            <span className="message-demo">Demo data</span>
          )}
        </div>
        <div className="message-bubble">
          <p className="message-text">{message.answer ?? message.question}</p>
          {assistant && !message.grounded && (
            <p className="evidence-note">
              <Icon name="alert" size={15} /> No supporting course evidence was
              found. This answer is not verified.
            </p>
          )}
          {assistant && message.grounded && message.sources.length === 0 && (
            <p className="evidence-note">
              <Icon name="alert" size={15} /> No source details were returned.
              Check the original course materials.
            </p>
          )}
          {assistant && message.grounded && message.sources.length > 0 && (
            <section className="sources" aria-label="Response sources">
              <h3>
                <Icon name="source" size={15} />{' '}
                {isMockChat ? 'Demo sources' : 'Sources'}{' '}
                <span>{message.sources.length}</span>
              </h3>
              <div className="source-list">
                {message.sources.map((source, index) => (
                  <div className="source-card" key={index}>
                    <span className="source-number">{index + 1}</span>
                    <div>
                      {source.title && <h4>{source.title}</h4>}
                      {source.excerpt && <p>{source.excerpt}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  )
}

export default function ChatPanel({ courseId }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const requestRef = useRef(null)
  const nextId = useRef(0)

  useEffect(() => () => requestRef.current?.abort(), [])

  useEffect(() => {
    // Scroll only the conversation, keeping the composer and page stable.
    const container = scrollRef.current
    if (container) {
      container.scrollTop = messages.length ? container.scrollHeight : 0
    }
  }, [messages, pending, error])

  async function sendQuestion(
    text,
    { retry = false, selectedCourseId = courseId } = {}
  ) {
    const trimmed = text.trim()
    // The ref closes the gap before React commits the disabled button state.
    if (!trimmed || requestRef.current) return

    const controller = new AbortController()
    requestRef.current = controller
    setPending(true)
    setError(null)
    if (!retry) {
      const message = {
        id: nextId.current++,
        role: 'student',
        question: trimmed,
      }
      setMessages((previous) => [...previous, message])
      setQuestion('')
    }

    const timeout = setTimeout(() => controller.abort('timeout'), 30000)
    try {
      const answer = await requestChat(trimmed, {
        courseId: selectedCourseId,
        signal: controller.signal,
      })
      if (!controller.signal.aborted) {
        const message = { ...answer, id: nextId.current++, role: 'assistant' }
        setMessages((previous) => [...previous, message])
      }
    } catch (failure) {
      if (
        !controller.signal.aborted ||
        controller.signal.reason === 'timeout'
      ) {
        setError({
          message:
            controller.signal.reason === 'timeout'
              ? 'The response took too long. Please try again.'
              : failure.message,
          question: trimmed,
          courseId: selectedCourseId,
        })
      }
    } finally {
      clearTimeout(timeout)
      if (requestRef.current === controller) {
        requestRef.current = null
        if (
          !controller.signal.aborted ||
          controller.signal.reason === 'timeout'
        ) {
          setPending(false)
          // Do not steal focus if the student moved to another control while waiting.
          if (document.activeElement === document.body)
            inputRef.current?.focus()
        }
      }
    }
  }

  function submit(event) {
    event.preventDefault()
    sendQuestion(question)
  }

  return (
    <section className="chat-panel" aria-labelledby="chat-title">
      <header className="chat-header">
        <span className="assistant-mark">
          <Icon name="sparkle" size={21} />
        </span>
        <div>
          <h2 id="chat-title">Your academic assistant</h2>
          <p>Course questions start here</p>
        </div>
        <span className="source-badge">
          <Icon name="source" size={14} /> Source-aware
        </span>
      </header>

      <div
        className="conversation"
        ref={scrollRef}
        role="region"
        aria-label="Conversation history"
        tabIndex={0}
      >
        {messages.length === 0 && (
          <Welcome
            onSuggestion={(value) => {
              setQuestion(value)
              inputRef.current?.focus()
            }}
          />
        )}
        <div
          className="message-log"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
          aria-relevant="additions"
          aria-atomic="false"
        >
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        {pending && (
          <div className="loading-message" role="status">
            <span className="assistant-avatar message-avatar">
              <Icon name="sparkle" size={18} />
            </span>
            <span className="typing-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>Looking through course information…</span>
          </div>
        )}
        {error && (
          <div className="error-message" role="alert">
            <Icon name="alert" size={20} />
            <div>
              <strong>We couldn’t get an answer</strong>
              <p>{error.message}</p>
              <button
                type="button"
                className="retry-button"
                onClick={() =>
                  sendQuestion(error.question, {
                    retry: true,
                    selectedCourseId: error.courseId,
                  })
                }
              >
                <Icon name="retry" size={15} /> Retry question
              </button>
            </div>
          </div>
        )}
      </div>

      <form
        className="composer"
        onSubmit={submit}
        aria-label="Ask SmartCampus"
        aria-busy={pending}
      >
        <div className="composer-box">
          <label htmlFor="question" className="sr-only">
            Your question
          </label>
          <textarea
            id="question"
            ref={inputRef}
            rows={2}
            value={question}
            placeholder="Ask about deadlines, coursework, or university rules…"
            aria-describedby="composer-hint"
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing &&
                event.keyCode !== 229
              ) {
                event.preventDefault()
                sendQuestion(question)
              }
            }}
          />
          <div className="composer-bottom">
            <span id="composer-hint">
              <kbd>Enter</kbd> to send <span aria-hidden="true">·</span>{' '}
              <kbd>Shift + Enter</kbd> for a new line
            </span>
            <button
              className="send-button"
              type="submit"
              disabled={pending || !question.trim()}
              aria-label="Send question"
            >
              <span>{pending ? 'Sending' : 'Send'}</span>
              <Icon name="send" size={17} />
            </button>
          </div>
        </div>
        <p className="composer-note">
          {isMockChat
            ? 'Demo mode uses fictional local responses. No requests are sent to the chat backend.'
            : 'Answers depend on available course materials. Source details appear below each supported answer.'}
        </p>
      </form>
    </section>
  )
}

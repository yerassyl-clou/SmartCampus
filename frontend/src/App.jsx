import React from 'react'
import ChatPanel from './components/ChatPanel.jsx'
import Icon from './components/Icon.jsx'
import { isMockChat } from './lib/chat.js'

export default function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#question">
        Skip to question input
      </a>
      <aside className="sidebar" aria-label="SmartCampus workspace">
        <a
          className="wordmark"
          href="#main-content"
          aria-label="SmartCampus home"
        >
          <span className="brand-icon">
            <Icon name="campus" size={25} />
          </span>
          <span>
            SmartCampus
            <span className="wordmark-caption">
              A little help. A clearer day.
            </span>
          </span>
        </a>
        <div className="sidebar-section">
          <p className="eyebrow">Student workspace</p>
          <nav aria-label="Main navigation">
            <a className="nav-item" href="#main-content" aria-current="page">
              <Icon name="chat" size={19} /> Academic assistant{' '}
              <span className="nav-dot" />
            </a>
          </nav>
        </div>
        <div className="sidebar-guide">
          <span className="guide-icon">
            <Icon name="book" size={21} />
          </span>
          <h2>
            Less searching.
            <br />
            More understanding.
          </h2>
          <p>
            Ask about your coursework and find the details that matter, with
            sources you can check.
          </p>
          <div className="guide-topics">
            <span>Assignments</span>
            <span>Schedules</span>
            <span>Course requirements</span>
          </div>
        </div>
        <div className="sidebar-footer">
          <Icon name="shield" size={17} />
          <span>
            Built for learning<span>Fictional university data</span>
          </span>
        </div>
      </aside>

      <main className="workspace" id="main-content">
        <header className="workspace-header">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span aria-hidden="true">/</span>
            <strong>Academic assistant</strong>
          </div>
          <span className="workspace-label">
            <Icon name="book" size={15} /> Student edition
          </span>
        </header>
        <div className="page-heading">
          <div>
            <p className="eyebrow">A clearer campus day</p>
            <h1>Academic assistant</h1>
            <p>Your questions, connected to your course materials.</p>
          </div>
          {isMockChat && (
            <span className="demo-badge">
              <span /> Demo data · Mock mode
            </span>
          )}
        </div>
        <ChatPanel />
        <footer className="workspace-footer">
          SmartCampus helps you find information. Always check the original
          course materials.
        </footer>
      </main>
    </div>
  )
}

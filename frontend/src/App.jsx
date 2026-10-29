import { useEffect, useState } from 'react'

export default function App() {
  const [health, setHealth] = useState('Checking API…')
  useEffect(() => { fetch('/api/health').then(r => r.ok ? r.json() : Promise.reject()).then(d => setHealth(d.status)).catch(() => setHealth('Backend not reachable')) }, [])
  return <main className="shell">
    <header><div className="brand">SC</div><div><h1>SmartCampus</h1><p>AI assistant for university students</p></div></header>
    <section className="notice"><strong>Starter scaffold</strong><p>This is the project base. Chat UI, deadlines, SQLite retrieval, and LLM integration are Sprint tasks, not yet implemented.</p><p><strong>Backend status:</strong> {health}</p></section>
    <section className="columns"><article><h2>Chat · SIS89-04/06/07</h2><p>Danaya builds the interaction; Ratislav connects grounded AI answers.</p></article><article><h2>Deadlines · SIS89-02/03/05</h2><p>Gleb provides fictional data; Danaya builds the deadline dashboard.</p></article></section>
  </main>
}

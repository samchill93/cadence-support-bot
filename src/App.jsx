import { useState, useRef, useEffect } from 'react'

const GREETING =
  "Hi! I'm the Cadence support assistant. Ask me anything about using Cadence — features, plans, billing, or how to get something done."

const SAMPLE_QUESTIONS = [
  'How much is the Pro plan?',
  'How do I invite my team?',
  'Can I get a refund on my account?',
  'Do you have a Gantt chart view?',
]

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(textOverride) {
    const text = (textOverride ?? input).trim()
    if (!text || loading) return

    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            "Sorry — I couldn't reach the server just then. Please try again in a moment.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="app">
      <header className="chat-header">
        <div className="brand">
          <span className="logo">C</span>
          <div>
            <div className="name">Cadence</div>
            <div className="status">
              <span className="online"></span>Support Assistant
            </div>
          </div>
        </div>
      </header>

      <div className="demo-banner">
        Live demo of a custom AI support bot built on the Claude API — try asking about billing, refunds, or product features.
      </div>

      <main className="messages">
        <div className="row assistant">
          <div className="bubble">{GREETING}</div>
        </div>

        {messages.length === 0 && !loading && (
          <div className="chips">
            {SAMPLE_QUESTIONS.map((q) => (
              <button key={q} className="chip" onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`row ${m.role}`}>
            <div className="bubble">{m.content}</div>
          </div>
        ))}

        {loading && (
          <div className="row assistant">
            <div className="bubble typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </main>

      <footer className="composer">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about features, plans, or how to…"
          rows={1}
        />
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading}>
          Send
        </button>
      </footer>

      <p className="powered">Powered by Claude · AI assistant</p>
    </div>
  )
}
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'

const PatientChat = ({ onLogout }) => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [patient, setPatient] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchPatient()
    fetchChatHistory()
  }, [patientId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchPatient = async () => {
    try {
      const response = await api.get(`/patients/${patientId}`)
      setPatient(response.data)
    } catch (err) {
      console.error('Failed to fetch patient:', err)
    }
  }

  const fetchChatHistory = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/chat/${patientId}`)
      setMessages(response.data.messages || [])
    } catch (err) {
      console.error('Failed to fetch chat history:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    const userMessage = newMessage.trim()
    setNewMessage('')
    setSending(true)

    // Add user message to UI immediately
    const tempUserMessage = {
      id: Date.now(),
      user_message: userMessage,
      ai_response: null,
      created_at: new Date().toISOString(),
      isSending: true
    }
    setMessages([...messages, tempUserMessage])

    try {
      const response = await api.post('/chat', {
        patientId: parseInt(patientId),
        message: userMessage
      })

      // Update the message with AI response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempUserMessage.id 
            ? { ...response.data.chat, isSending: false }
            : msg
        )
      )
    } catch (err) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempUserMessage.id 
            ? { ...msg, ai_response: 'Failed to get response. Please try again.', isSending: false }
            : msg
        )
      )
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            style={{ marginRight: '10px' }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ display: 'inline', marginLeft: '10px' }}>
            Chat with AI Assistant for {patient?.name || 'Patient'}
          </h1>
        </div>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="card">
        <div className="chat-container">
          <div className="chat-messages">
            {loading ? (
              <div className="loading">Loading chat history...</div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No messages yet. Start a conversation!
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id || msg.created_at}>
                  <div className="message user">
                    <div>{msg.user_message}</div>
                    <div className="message-time">{formatTime(msg.created_at)}</div>
                  </div>
                  {msg.isSending ? (
                    <div className="message ai">
                      <div>Thinking...</div>
                    </div>
                  ) : msg.ai_response ? (
                    <div className="message ai">
                      <div>{msg.ai_response}</div>
                      <div className="message-time">{formatTime(msg.created_at)}</div>
                    </div>
                  ) : null}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={sending || !newMessage.trim()}
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PatientChat

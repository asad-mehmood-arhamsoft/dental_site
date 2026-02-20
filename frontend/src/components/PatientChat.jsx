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
  const inputRef = useRef(null)

  useEffect(() => {
    fetchPatient()
    fetchChatHistory()
  }, [patientId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus()
  }, [])

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
      inputRef.current?.focus()
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString()
    
    if (isToday) return 'Today'
    if (isYesterday) return 'Yesterday'
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const shouldShowDateSeparator = (currentMsg, prevMsg) => {
    if (!prevMsg) return true
    const currentDate = new Date(currentMsg.created_at).toDateString()
    const prevDate = new Date(prevMsg.created_at).toDateString()
    return currentDate !== prevDate
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-header-left">
          <button
            className="chat-back-btn"
            onClick={() => navigate('/')}
            title="Back to Dashboard"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="chat-patient-info">
            <div className="chat-patient-avatar">
              {patient?.name ? patient.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="chat-patient-details">
              <h1 className="chat-patient-name">
                {patient?.name || 'Patient'}
              </h1>
              <p className="chat-patient-subtitle">AI Assistant Chat</p>
            </div>
          </div>
        </div>
        <button className="chat-logout-btn" onClick={onLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>

      <div className="chat-wrapper">
        <div className="chat-container">
          <div className="chat-messages">
            {loading ? (
              <div className="chat-loading">
                <div className="chat-loading-spinner"></div>
                <p>Loading chat history...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="chat-empty">
                <div className="chat-empty-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>No messages yet</h3>
                <p>Start a conversation with the AI assistant</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const showDate = shouldShowDateSeparator(msg, messages[index - 1])
                return (
                  <React.Fragment key={msg.id || msg.created_at || index}>
                    {showDate && (
                      <div className="chat-date-separator">
                        <span>{formatDate(msg.created_at)}</span>
                      </div>
                    )}
                    <div className="chat-message-group">
                      <div className="chat-message chat-message-user">
                        <div className="chat-message-content">
                          <div className="chat-message-text">{msg.user_message}</div>
                          <div className="chat-message-time">{formatTime(msg.created_at)}</div>
                        </div>
                        <div className="chat-message-avatar user-avatar">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      {msg.isSending ? (
                        <div className="chat-message chat-message-ai">
                          <div className="chat-message-avatar ai-avatar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.663 17H4.662C3.742 17 3 16.258 3 15.338V4.662C3 3.742 3.742 3 4.662 3H19.338C20.258 3 21 3.742 21 4.662V15.338C21 16.258 20.258 17 19.338 17H14.337L9.663 21V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="chat-message-content">
                            <div className="chat-message-text">
                              <div className="chat-typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : msg.ai_response ? (
                        <div className="chat-message chat-message-ai">
                          <div className="chat-message-avatar ai-avatar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.663 17H4.662C3.742 17 3 16.258 3 15.338V4.662C3 3.742 3.742 3 4.662 3H19.338C20.258 3 21 3.742 21 4.662V15.338C21 16.258 20.258 17 19.338 17H14.337L9.663 21V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="chat-message-content">
                            <div className="chat-message-text">{msg.ai_response}</div>
                            <div className="chat-message-time">{formatTime(msg.created_at)}</div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </React.Fragment>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-wrapper">
            <div className="chat-input-container">
              <input
                ref={inputRef}
                type="text"
                className="chat-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={sending}
                maxLength={500}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={sending || !newMessage.trim()}
                title="Send message"
              >
                {sending ? (
                  <div className="chat-send-spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
            {newMessage.length > 0 && (
              <div className="chat-input-counter">
                {newMessage.length}/500
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default PatientChat

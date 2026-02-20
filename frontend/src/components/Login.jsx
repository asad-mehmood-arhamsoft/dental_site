import React, { useState, useRef, useEffect } from 'react'
import api from '../utils/api'
import { loginSchema, registerSchema } from '../validation/schemas/authSchemas'

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const errorRef = useRef('')

  useEffect(() => {
    if (error) {
      errorRef.current = error
    }
  }, [error])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }))
    }
  }

  const validateField = async (name, value) => {
    const schema = isLogin ? loginSchema : registerSchema
    try {
      await schema.validateAt(name, { [name]: value })
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }))
    } catch (err) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: err.message
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      const schema = isLogin ? loginSchema : registerSchema
      await schema.validate(formData, { abortEarly: false })

      setError('')
      errorRef.current = ''

      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const response = await api.post(endpoint, formData)
      
      if (response.data.token) {
        setError('')
        errorRef.current = ''
        setErrors({})
        onLogin(response.data.token)
      }
    } catch (err) {
      if (err.inner) {
        const yupErrors = {}
        err.inner.forEach((error) => {
          yupErrors[error.path] = error.message
        })
        setErrors(yupErrors)
        setError('')
        errorRef.current = ''
      } else {
        const apiError = err.response?.data
        if (apiError?.errors && Array.isArray(apiError.errors) && apiError.errors.length > 0) {
          const backendErrors = {}
          apiError.errors.forEach((error) => {
            backendErrors[error.path] = error.msg
          })
          setErrors(backendErrors)
          setError('')
          errorRef.current = ''
        } else {
          const errorMessage = apiError?.error || err.message || 'Invalid credentials'
          setErrors({})
          setError(errorMessage)
          errorRef.current = errorMessage
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9H21ZM19 21H5V3H13V9H19V21Z" fill="currentColor"/>
                <path d="M8 13H16V15H8V13ZM8 17H13V19H8V17Z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="login-title">Dental Clinic</h1>
            <p className="login-subtitle">Patient Management System</p>
          </div>

          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true)
                setError('')
                errorRef.current = ''
                setErrors({})
                setFormData({ email: '', password: '' })
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`login-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false)
                setError('')
                errorRef.current = ''
                setErrors({})
                setFormData({ email: '', password: '' })
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                  className={errors.email ? 'error-input' : ''}
                />
              </div>
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 3C13.66 3 15 4.34 15 6V8H9V6C9 4.34 10.34 3 12 3ZM18 20H6V10H18V20Z" fill="currentColor"/>
                </svg>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  className={errors.password ? 'error-input' : ''}
                />
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            {(error || errorRef.current) && (
              <div 
                key={`error-${error || errorRef.current}`}
                className="error-alert"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                </svg>
                <span>{error || errorRef.current}</span>
              </div>
            )}

            <button
              type="submit"
              className={`login-submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="32">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                className="login-link-btn"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  errorRef.current = ''
                  setErrors({})
                  setFormData({ email: '', password: '' })
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

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
    <div className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
      <div className="card">
        <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>
          Dental Clinic
        </h1>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
          {isLogin ? 'Login' : 'Register'}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
            />
            {errors.email && <div className="error" style={{ fontSize: '12px', marginTop: '5px' }}>{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
            />
            {errors.password && <div className="error" style={{ fontSize: '12px', marginTop: '5px' }}>{errors.password}</div>}
          </div>

          {(error || errorRef.current) && (
            <div 
              key={`error-${error || errorRef.current}`}
              className="error" 
              style={{ 
                marginTop: '10px', 
                padding: '10px', 
                backgroundColor: '#fee', 
                border: '1px solid #fcc', 
                borderRadius: '4px',
                color: '#c33',
                fontWeight: '500',
                display: 'block'
              }}
            >
              {error || errorRef.current}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              errorRef.current = ''
              setErrors({})
              setFormData({ email: '', password: '' })
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login

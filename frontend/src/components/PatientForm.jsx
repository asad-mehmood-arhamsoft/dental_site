import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import { patientSchema } from '../validation/schemas/patientSchemas'

const PatientForm = ({ patient, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    medicalNotes: ''
  })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (patient) {
      let formattedDob = ''
      if (patient.date_of_birth) {
        const date = new Date(patient.date_of_birth)
        if (!isNaN(date.getTime())) {
          formattedDob = date.toISOString().split('T')[0]
        }
      }
      
      setFormData({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        dob: formattedDob,
        medicalNotes: patient.medical_notes || ''
      })
    }
  }, [patient])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
    setError('')
  }

  const validateField = async (name, value) => {
    try {
      await patientSchema.validateAt(name, { [name]: value })
      setErrors({
        ...errors,
        [name]: ''
      })
    } catch (err) {
      setErrors({
        ...errors,
        [name]: err.message
      })
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setErrors({})
    setLoading(true)

    try {
      await patientSchema.validate(formData, { abortEarly: false })
      
      if (patient) {
        await api.put(`/patients/${patient.id}`, formData)
      } else {
        await api.post('/patients', formData)
      }
      onSuccess()
    } catch (err) {
      if (err.inner) {
        const yupErrors = {}
        err.inner.forEach((error) => {
          yupErrors[error.path] = error.message
        })
        setErrors(yupErrors)
      } else {
        const apiError = err.response?.data
        if (apiError?.errors) {
          const backendErrors = {}
          apiError.errors.forEach((error) => {
            backendErrors[error.path] = error.msg
          })
          setErrors(backendErrors)
        } else {
          const errorMessage = apiError?.error || 'An error occurred'
          if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('already exists')) {
            setErrors({ email: errorMessage })
          } else {
            setError(errorMessage)
          }
        }
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="patient-form-modal">
      <button
        type="button"
        className="patient-form-backdrop"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="patient-form-modal-content" role="dialog" aria-modal="true">
        <div className="patient-form-header">
          <div className="patient-form-header-left">
            <div className="patient-form-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {patient ? (
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
            </div>
            <div>
              <h2 className="patient-form-title">{patient ? 'Edit Patient' : 'Add New Patient'}</h2>
              <p className="patient-form-subtitle">{patient ? 'Update patient information' : 'Fill in the details below'}</p>
            </div>
          </div>
          <button className="patient-form-close-btn" onClick={onClose} title="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="patient-form">
          <div className="patient-form-body">
            <div className="patient-form-section">
              <h3 className="patient-form-section-title">Personal Information</h3>
              
              <div className="patient-form-group">
              <label htmlFor="name" className="patient-form-label">
                <svg className="patient-form-label-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Full Name <span className="required">*</span>
              </label>
              <div className="patient-form-input-wrapper">
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter patient's full name"
                  className={`patient-form-input ${errors.name ? 'error' : ''}`}
                />
              </div>
              {errors.name && (
                <div className="patient-form-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="patient-form-group">
              <label htmlFor="email" className="patient-form-label">
                <svg className="patient-form-label-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Email Address <span className="required">*</span>
              </label>
              <div className="patient-form-input-wrapper">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="patient@example.com"
                  className={`patient-form-input ${errors.email ? 'error' : ''}`}
                />
              </div>
              {errors.email && (
                <div className="patient-form-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className="patient-form-group">
              <label htmlFor="phone" className="patient-form-label">
                <svg className="patient-form-label-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Phone Number <span className="required">*</span>
              </label>
              <div className="patient-form-input-wrapper">
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., 03092298121"
                  className={`patient-form-input ${errors.phone ? 'error' : ''}`}
                />
              </div>
              {errors.phone && (
                <div className="patient-form-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            <div className="patient-form-group">
              <label htmlFor="dob" className="patient-form-label">
                <svg className="patient-form-label-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Date of Birth <span className="required">*</span>
              </label>
              <div className="patient-form-input-wrapper">
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`patient-form-input ${errors.dob ? 'error' : ''}`}
                />
              </div>
              {errors.dob && (
                <div className="patient-form-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{errors.dob}</span>
                </div>
              )}
            </div>
            </div>

            <div className="patient-form-section">
              <h3 className="patient-form-section-title">Medical Information</h3>
              
              <div className="patient-form-group">
              <label htmlFor="medicalNotes" className="patient-form-label">
                <svg className="patient-form-label-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Medical Notes <span className="required">*</span>
              </label>
              <div className="patient-form-input-wrapper">
                <textarea
                  id="medicalNotes"
                  name="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter patient's medical history, allergies, medications, and other relevant notes..."
                  rows="5"
                  className={`patient-form-textarea ${errors.medicalNotes ? 'error' : ''}`}
                  maxLength={1000}
                />
                <div className="patient-form-char-count">
                  {formData.medicalNotes.length}/1000
                </div>
              </div>
              {errors.medicalNotes && (
                <div className="patient-form-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{errors.medicalNotes}</span>
                </div>
              )}
            </div>
            </div>

            {error && (
              <div className="patient-form-alert patient-form-alert-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="patient-form-actions">
            <button
              type="button"
              className="patient-form-btn patient-form-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="patient-form-btn patient-form-btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="patient-form-btn-spinner"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{patient ? 'Update Patient' : 'Create Patient'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PatientForm

import React, { useState, useEffect } from 'react'
import * as yup from 'yup'
import api from '../utils/api'

// Yup validation schema
const patientSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits'),
  dob: yup
    .string()
    .required('Date of birth is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)'),
  medicalNotes: yup
    .string()
    .required('Medical notes are required')
    .min(5, 'Medical notes must be at least 5 characters')
    .max(1000, 'Medical notes must be less than 1000 characters')
})

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
      // Format date for date input (YYYY-MM-DD)
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
    // Clear field error when user starts typing
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
      // Validate entire form
      await patientSchema.validate(formData, { abortEarly: false })
      
      if (patient) {
        await api.put(`/patients/${patient.id}`, formData)
      } else {
        await api.post('/patients', formData)
      }
      onSuccess()
    } catch (err) {
      if (err.inner) {
        // Yup validation errors
        const yupErrors = {}
        err.inner.forEach((error) => {
          yupErrors[error.path] = error.message
        })
        setErrors(yupErrors)
      } else {
        // API errors
        const apiError = err.response?.data
        if (apiError?.errors) {
          // Backend validation errors
          const backendErrors = {}
          apiError.errors.forEach((error) => {
            backendErrors[error.path] = error.msg
          })
          setErrors(backendErrors)
        } else {
          setError(apiError?.error || 'An error occurred')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{patient ? 'Edit Patient' : 'Add Patient'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && <div className="error" style={{ fontSize: '12px', marginTop: '5px' }}>{errors.name}</div>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && <div className="error" style={{ fontSize: '12px', marginTop: '5px' }}>{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., 03092298121"
            />
            {errors.phone && <div className="error" style={{ fontSize: '12px', marginTop: '5px' }}>{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.dob && <div className="error" style={{ fontSize: '12px', marginTop: '5px' }}>{errors.dob}</div>}
          </div>

          <div className="form-group">
            <label>Medical Notes *</label>
            <textarea
              name="medicalNotes"
              value={formData.medicalNotes}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter patient's medical notes..."
            />
            {errors.medicalNotes && <div className="error" style={{ fontSize: '12px', marginTop: '5px' }}>{errors.medicalNotes}</div>}
          </div>

          {error && <div className="error">{error}</div>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : patient ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PatientForm

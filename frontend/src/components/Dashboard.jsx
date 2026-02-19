import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import PatientForm from './PatientForm'
import PatientList from './PatientList'

const Dashboard = ({ onLogout }) => {
  const [patients, setPatients] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchPatients()
  }, [pagination.page])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/patients?page=${pagination.page}&limit=${pagination.limit}`)
      setPatients(response.data.patients)
      setPagination(response.data.pagination)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch patients')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPatient(null)
    setShowForm(true)
  }

  const handleEdit = (patient) => {
    setEditingPatient(patient)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return
    }

    try {
      await api.delete(`/patients/${id}`)
      fetchPatients()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete patient')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingPatient(null)
    fetchPatients()
  }

  const handleChat = (patientId) => {
    navigate(`/chat/${patientId}`)
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Patient Dashboard</h1>
        <div>
          <button className="btn btn-primary" onClick={handleCreate} style={{ marginRight: '10px' }}>
            Add Patient
          </button>
          <button className="btn btn-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error" style={{ marginBottom: '20px' }}>{error}</div>}

      {showForm && (
        <PatientForm
          patient={editingPatient}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}

      <PatientList
        patients={patients}
        loading={loading}
        pagination={pagination}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChat={handleChat}
        onPageChange={(page) => setPagination({ ...pagination, page })}
      />
    </div>
  )
}

export default Dashboard

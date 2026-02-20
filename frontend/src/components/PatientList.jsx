import React from 'react'

const PatientList = ({ patients, loading, pagination, onEdit, onDelete, onChat, onPageChange }) => {
  if (loading) {
    return <div className="loading">Loading patients...</div>
  }

  if (patients.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', color: '#666' }}>No patients found. Add your first patient!</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of Birth</th>
              <th>Medical Notes</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.email || 'N/A'}</td>
                <td>{patient.phone || 'N/A'}</td>
                <td>{formatDate(patient.date_of_birth)}</td>
                <td
                  style={{
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={patient.medical_notes || 'N/A'}
                >
                  {patient.medical_notes || 'N/A'}
                </td>
                <td>{formatDate(patient.created_at)}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => onEdit(patient)}
                      style={{ padding: '6px 12px', fontSize: '13px', minWidth: '60px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => onChat(patient.id)}
                      style={{ padding: '6px 12px', fontSize: '13px', minWidth: '60px' }}
                    >
                      Chat
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => onDelete(patient.id)}
                      style={{ padding: '6px 12px', fontSize: '13px', minWidth: '60px' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages} (Total: {pagination.total})
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}

export default PatientList

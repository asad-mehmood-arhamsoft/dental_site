import React from 'react'

const PatientList = ({ patients, loading, pagination, onEdit, onDelete, onChat, onPageChange, searchQuery }) => {
  if (loading) {
    return (
      <div className="patient-list-loading">
        <div className="patient-list-spinner"></div>
        <p>Loading patients...</p>
      </div>
    )
  }

  if (patients.length === 0) {
    return (
      <div className="patient-list-empty">
        <div className="patient-list-empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>{searchQuery ? 'No patients found' : 'No patients yet'}</h3>
        <p>{searchQuery ? 'Try adjusting your search criteria' : 'Add your first patient to get started'}</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <>
      <div className="patient-list-container">
        <div className="patient-list-header">
          <h2>Patients</h2>
          {searchQuery && (
            <span className="patient-list-search-count">
              {patients.length} {patients.length === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>
        <div className="patient-list-grid">
          {patients.map((patient) => (
            <div key={patient.id} className="patient-card">
              <div className="patient-card-header">
                <div className="patient-card-avatar">
                  {getInitials(patient.name)}
                </div>
                <div className="patient-card-info">
                  <h3 className="patient-card-name">{patient.name}</h3>
                  <p className="patient-card-email">{patient.email || 'No email'}</p>
                </div>
              </div>
              <div className="patient-card-body">
                <div className="patient-card-field">
                  <svg className="patient-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="patient-field-label">Phone:</span>
                  <span className="patient-field-value">{patient.phone || 'N/A'}</span>
                </div>
                <div className="patient-card-field">
                  <svg className="patient-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="patient-field-label">DOB:</span>
                  <span className="patient-field-value">{formatDate(patient.date_of_birth)}</span>
                </div>
                {patient.medical_notes && (
                  <div className="patient-card-field patient-card-notes">
                    <svg className="patient-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="patient-field-label">Notes:</span>
                    <span className="patient-field-value" title={patient.medical_notes}>
                      {patient.medical_notes.length > 50 
                        ? patient.medical_notes.substring(0, 50) + '...' 
                        : patient.medical_notes}
                    </span>
                  </div>
                )}
                <div className="patient-card-field patient-card-date">
                  <svg className="patient-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="patient-field-label">Created:</span>
                  <span className="patient-field-value">{formatDate(patient.created_at)}</span>
                </div>
              </div>
              <div className="patient-card-actions">
                <button
                  className="patient-action-btn patient-action-chat"
                  onClick={() => onChat(patient.id)}
                  title="Start chat"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.663 17H4.662C3.742 17 3 16.258 3 15.338V4.662C3 3.742 3.742 3 4.662 3H19.338C20.258 3 21 3.742 21 4.662V15.338C21 16.258 20.258 17 19.338 17H14.337L9.663 21V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Chat</span>
                </button>
                <button
                  className="patient-action-btn patient-action-edit"
                  onClick={() => onEdit(patient)}
                  title="Edit patient"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  className="patient-action-btn patient-action-delete"
                  onClick={() => onDelete(patient.id)}
                  title="Delete patient"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="patient-pagination">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Previous</span>
          </button>
          <div className="pagination-info">
            <span className="pagination-text">
              Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
            </span>
            <span className="pagination-total">({pagination.total} total)</span>
          </div>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            <span>Next</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </>
  )
}

export default PatientList

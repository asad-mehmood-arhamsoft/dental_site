import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import PatientForm from "./PatientForm";
import PatientList from "./PatientList";
import ConfirmationModal from "./ConfirmationModal";

const Dashboard = ({ onLogout }) => {
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'delete' or 'logout'
  const [deletePatientId, setDeletePatientId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, [pagination.page]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/patients?page=${pagination.page}&limit=${pagination.limit}`,
      );
      setPatients(response.data.patients);
      setPagination(response.data.pagination);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeletePatientId(id);
    setConfirmAction("delete");
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/patients/${deletePatientId}`);
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete patient");
    } finally {
      setShowConfirmModal(false);
      setDeletePatientId(null);
      setConfirmAction(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPatient(null);
    fetchPatients();
  };

  const handleChat = (patientId) => {
    navigate(`/chat/${patientId}`);
  };

  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(query) ||
      patient.email?.toLowerCase().includes(query) ||
      patient.phone?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-title-section">
            <div className="dashboard-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9H21ZM19 21H5V3H13V9H19V21Z"
                  fill="currentColor"
                />
                <path
                  d="M8 13H16V15H8V13ZM8 17H13V19H8V17Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <h1 className="dashboard-title">Patient Dashboard</h1>
              <p className="dashboard-subtitle">
                Manage your dental clinic patients
              </p>
            </div>
          </div>
          <div className="dashboard-actions">
            <button className="dashboard-add-btn" onClick={handleCreate}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Add Patient</span>
            </button>
            <button
              className="dashboard-logout-btn"
              onClick={() => {
                setConfirmAction("logout");
                setShowConfirmModal(true);
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon stat-icon-primary">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{pagination.total}</div>
              <div className="stat-label">Total Patients</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-success">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.663 17H4.662C3.742 17 3 16.258 3 15.338V4.662C3 3.742 3.742 3 4.662 3H19.338C20.258 3 21 3.742 21 4.662V15.338C21 16.258 20.258 17 19.338 17H14.337L9.663 21V17Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{patients.length}</div>
              <div className="stat-label">On This Page</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-info">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{pagination.page}</div>
              <div className="stat-label">Current Page</div>
            </div>
          </div>
        </div>

        <div className="dashboard-main">
          <div className="dashboard-toolbar">
            <div className="dashboard-search">
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search patients by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dashboard-search-input"
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="dashboard-error">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                  fill="currentColor"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {showForm && (
            <PatientForm
              patient={editingPatient}
              onClose={handleFormClose}
              onSuccess={handleFormClose}
            />
          )}

          <PatientList
            patients={filteredPatients}
            loading={loading}
            pagination={pagination}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onChat={handleChat}
            onPageChange={(page) => setPagination({ ...pagination, page })}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        title={confirmAction === "delete" ? "Delete Patient" : "Logout"}
        message={
          confirmAction === "delete"
            ? "Are you sure you want to delete this patient? This action cannot be undone."
            : "Are you sure you want to log out? You will be redirected to the login page."
        }
        confirmText={confirmAction === "delete" ? "Delete" : "Logout"}
        cancelText="Cancel"
        isDangerous={confirmAction === "delete" || confirmAction === "logout"}
        onConfirm={() => {
          if (confirmAction === "delete") {
            handleConfirmDelete();
          } else if (confirmAction === "logout") {
            setShowConfirmModal(false);
            onLogout();
          }
        }}
        onCancel={() => {
          setShowConfirmModal(false);
          setConfirmAction(null);
          setDeletePatientId(null);
        }}
      />
    </div>
  );
};

export default Dashboard;

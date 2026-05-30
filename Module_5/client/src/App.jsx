import React, { useState, useEffect } from 'react';

function App() {
 
  const [role, setRole] = useState('User'); 
  const [requests, setRequests] = useState([]);
  
 
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
     
      let url = 'http://localhost:5000/requests';
      let queryParams = `?page=${page}&limit=3`; 

      if (role === 'User') {
        url = 'http://localhost:5000/my-requests';
      }

     
      if (status) queryParams += `&status=${status}`;
      if (category) queryParams += `&category=${category}`;
      if (startDate && endDate) queryParams += `&startDate=${startDate}&endDate=${endDate}`;

      
      if (role === 'Manager' && !status) {
        queryParams += `&status=Submitted`;
      }

      const response = await fetch(`${url}${queryParams}`);
      const result = await response.json();
      
      setRequests(result.data);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchRequests();
  }, [role, page, status, category, startDate, endDate]);

  
  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setStatus('');
    setCategory('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4 bg-light mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-primary m-0">Module 5: Dashboard</h2>
        
          <div className="d-flex align-items-center">
            <label className="me-2 fw-bold">Current Role:</label>
            <select className="form-select w-auto" value={role} onChange={handleRoleChange}>
              <option value="User">User (GET /my-requests)</option>
              <option value="Manager">Manager (GET /requests?status=Submitted)</option>
              <option value="Admin">Admin (GET /requests)</option>
            </select>
          </div>
        </div>
      </div>

      
      <div className="card p-4 mb-4 shadow-sm">
        <h5 className="mb-3 text-secondary">Filters</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select 
              className="form-select" 
              value={status} 
              onChange={(e) => handleFilterChange(setStatus, e.target.value)}
              disabled={role === 'Manager' && !status ? false : false}
            >
              <option value="">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={(e) => handleFilterChange(setCategory, e.target.value)}>
              <option value="">All Categories</option>
              <option value="IT">IT</option>
              <option value="Facilities">Facilities</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Start Date</label>
            <input type="date" className="form-select" value={startDate} onChange={(e) => handleFilterChange(setStartDate, e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">End Date</label>
            <input type="date" className="form-select" value={endDate} onChange={(e) => handleFilterChange(setEndDate, e.target.value)} />
          </div>
        </div>
      </div>

    
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover table-striped m-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Raised By</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="spinner-border text-primary" role="status"></div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No requests found.</td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.title}</td>
                    <td><span className="badge bg-secondary">{req.category}</span></td>
                    <td>{req.user}</td>
                    <td>{req.date}</td>
                    <td>
                      <span className={`badge ${
                        req.status === 'Approved' ? 'bg-success' : 
                        req.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-item page-link" onClick={() => setPage(page - 1)}>Previous</button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${page === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(index + 1)}>{index + 1}</button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className="page-item page-link" onClick={() => setPage(page + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';

function App() {
  const [logs, setLogs] = useState([]);
  const [requestId, setRequestId] = useState("1024");
  const [loading, setLoading] = useState(true);

  
  const [newStatus, setNewStatus] = useState("Pending Review");
  const [changedBy, setChangedBy] = useState("Alex Rivera");
  const [role, setRole] = useState("Client");

  
  const fetchLogs = () => {
    setLoading(true);
    fetch(`http://localhost:5000/requests/${requestId}/logs`)
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading timeline logs:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, [requestId]);

  
  const handleSubmitLog = (e) => {
    e.preventDefault();


    const oldStatus = logs.length > 0 ? logs[0].new_status : null;

    const payload = {
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: changedBy,
      role: role
    };

    fetch(`http://localhost:5000/requests/${requestId}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then((res) => res.json())
    .then((data) => {
    
      fetchLogs();
      alert(`Success: Status changed to "${newStatus}"`);
    })
    .catch((err) => console.error("Error adding log via website:", err));
  };

  return (
    <div className="container-fluid min-vh-screen d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: '#121214' }}>
      <div className="w-100 rounded-4 p-4 p-md-5 shadow-lg border" style={{ maxWidth: '720px', backgroundColor: '#1a1a1e', borderColor: '#3e3e46' }}>
        
   
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center pb-4 mb-4 gap-3" style={{ borderBottom: '2px solid #3e3e46' }}>
          <div>
            <h2 className="h3 fw-bold text-white mb-2 tracking-wide">Action Log Module</h2>
            <p className="text-light-50 small mb-0 fs-6" style={{ color: '#b2b2bf' }}>Audit trail for status movements</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold text-uppercase tracking-wider" style={{ fontSize: '12px', color: '#8e8e93' }}>Viewing:</span>
            <span className="badge rounded-pill px-3 py-2 fw-bold text-info border border-info fs-6" style={{ backgroundColor: 'rgba(13, 110, 253, 0.15)', borderColor: '#0dcaf0 !important' }}>
              #{requestId}
            </span>
          </div>
        </div>

       
        <div className="card p-4 mb-5 border rounded-3 text-white" style={{ backgroundColor: '#1f1f23', borderColor: '#3e3e46' }}>
          <h4 className="h6 text-uppercase fw-bold text-info mb-3 tracking-wider">⚡ Update Status From Website</h4>
          <form onSubmit={handleSubmitLog} className="row g-3">
            
            <div className="col-sm-6">
              <label className="form-label small text-secondary fw-semibold">New Status</label>
              <select className="form-select bg-dark text-white border-secondary" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="Draft">Draft</option>
                <option value="Pending Review">Pending Review</option>
                <option value="In Progress">In Progress</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="col-sm-6">
              <label className="form-label small text-secondary fw-semibold">Your Name</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" value={changedBy} onChange={(e) => setChangedBy(e.target.value)} placeholder="e.g. John Doe" required />
            </div>

            <div className="col-sm-6">
              <label className="form-label small text-secondary fw-semibold">User Role</label>
              <select className="form-select bg-dark text-white border-secondary" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Client">Client</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="col-sm-6 d-flex align-items-end">
              <button type="submit" className="btn btn-info w-100 fw-bold text-dark text-uppercase tracking-wide py-2">
                Submit Action Log
              </button>
            </div>

          </form>
        </div>

    
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-5 rounded-3 border" style={{ backgroundColor: '#151518', border: '2px dashed #4e4e56' }}>
            <p className="text-white fs-5 mb-2 fw-semibold">No action logs found for this request.</p>
            <p className="mb-0 px-3" style={{ fontSize: '13px', color: '#9a9aab' }}>
              make the status using the form
            </p>
          </div>
        ) : (

          <div className="position-relative ms-2" style={{ borderLeft: '3px solid #4e4e56', paddingLeft: '2rem' }}>
            {logs.map((log, index) => {
              const isLatest = index === 0;
              return (
                <div key={log._id || index} className="position-relative mb-5">
                  
                
                  <span 
                    className="position-absolute rounded-circle"
                    style={{
                      left: '-41px',
                      top: '8px',
                      width: '18px',
                      height: '18px',
                      border: isLatest ? '3px solid #2ecc71' : '3px solid #a1a1a1',
                      backgroundColor: isLatest ? '#2ecc71' : '#1a1a1e',
                      boxShadow: isLatest ? '0 0 12px #2ecc71' : 'none',
                      zIndex: 2
                    }}
                  />

               
                  <div className="card border p-4 rounded-3 shadow" style={{ backgroundColor: '#242428', borderColor: '#3e3e46' }}>
                    
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-2 mb-3">
                      <h3 className={`h5 mb-0 fw-extrabold`} style={{ color: isLatest ? '#2ecc71' : '#ffffff' }}>
                        {log.new_status}
                      </h3>
                      <span className="fw-medium" style={{ fontSize: '12px', color: '#a1a1b2' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="fs-6 mb-3" style={{ color: '#e1e1e6' }}>
                      {log.old_status ? (
                        <span>
                          Moved from <span className="fw-bold px-2 py-1 rounded mx-1" style={{ backgroundColor: '#1a1a1e', color: '#ffc107' }}>"{log.old_status}"</span>
                        </span>
                      ) : (
                        <span className="badge px-2.5 py-1.5 text-success border border-success-subtle" style={{ backgroundColor: 'rgba(46, 204, 113, 0.15)', fontSize: '12px' }}>
                          🌱 Initial Creation
                        </span>
                      )}
                    </p>

                    <div className="d-flex align-items-center gap-2 pt-3 border-top" style={{ borderColor: '#3e3e46' }}>
                      <div className="rounded-circle d-flex align-items-center justify-content-center text-uppercase fw-bold text-white" 
                           style={{ width: '26px', height: '26px', fontSize: '12px', backgroundColor: '#4e4e56' }}>
                        {log.changed_by ? log.changed_by.charAt(0) : '?'}
                      </div>
                      <span className="fw-semibold" style={{ fontSize: '13px', color: '#d1d1d6' }}>
                        By {log.changed_by}
                      </span>
                      <span className="badge text-uppercase ms-auto" 
                            style={{ 
                              fontSize: '10px',
                              padding: '5px 10px',
                              letterSpacing: '0.5px',
                              backgroundColor: log.role.toLowerCase() === 'admin' || log.role.toLowerCase() === 'manager' ? 'rgba(155, 89, 182, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                              color: log.role.toLowerCase() === 'admin' || log.role.toLowerCase() === 'manager' ? '#ca9fff' : '#e1e1e6',
                              border: log.role.toLowerCase() === 'admin' || log.role.toLowerCase() === 'manager' ? '1px solid #9b59b6' : '1px solid #6c757d'
                            }}>
                        {log.role}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
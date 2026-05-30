import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkflowRequest = () => {
  
  const [currentRole, setCurrentRole] = useState('User');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);


  const API_URL = 'http://localhost:5000/api/requests';

  
  const fetchRequests = async () => {
    try {
      const res = await axios.get(API_URL);
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching requests', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, nextStatus) => {
    try {
  
      const res = await axios.patch(`${API_URL}/${id}/status`, 
        { status: nextStatus },
        { headers: { 'x-user-role': currentRole } }
      );
      
      alert(res.data.message);
      fetchRequests(); 
    } catch (err) {
    
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  if (loading) return <h3>Loading requests from backend...</h3>;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Module 3: Workflow Engine (Core Logic)</h2>
      
    
      <div style={{ padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px', marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Test your Role: </label>
        <select value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} style={{ padding: '5px 10px', fontSize: '16px' }}>
          <option value="User">User (Employee)</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
        </select>
        <p style={{ margin: '5px 0 0 0', color: '#555', fontSize: '14px' }}>
          Current Logged-in as: <strong style={{ color: 'blue' }}>{currentRole}</strong>
        </p>
      </div>

      
      <h3>All Requests</h3>
      {requests.length === 0 ? <p>No requests found in DB.</p> : (
        requests.map((req) => (
          <div key={req._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', marginBottom: '15px', backgroundColor: '#fff' }}>
            <h4>{req.title}</h4>
            <p style={{ color: '#666' }}>{req.description}</p>
            <p>Status: <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#e0e0e0', fontWeight: 'bold' }}>{req.status}</span></p>
            
            <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <span style={{ fontSize: '14px', color: '#888', display: 'block', marginBottom: '5px' }}>Actions Available:</span>

              
              {currentRole === 'Manager' && req.status === 'Submitted' && (
                <>
                  <button onClick={() => handleStatusUpdate(req._id, 'Approved')} style={{ backgroundColor: 'green', color: 'white', marginRight: '5px', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>Approve</button>
                  <button onClick={() => handleStatusUpdate(req._id, 'Rejected')} style={{ backgroundColor: 'red', color: 'white', marginRight: '5px', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>Reject</button>
                  <button onClick={() => handleStatusUpdate(req._id, 'Needs Clarification')} style={{ backgroundColor: 'orange', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>Needs Clarification</button>
                </>
              )}

             
              {currentRole === 'User' && req.status === 'Needs Clarification' && (
                <button onClick={() => handleStatusUpdate(req._id, 'Submitted')} style={{ backgroundColor: 'blue', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>
                  Resubmit Request
                </button>
              )}

              
              {currentRole === 'Admin' && req.status === 'Approved' && (
                <button onClick={() => handleStatusUpdate(req._id, 'Closed')} style={{ backgroundColor: 'black', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>
                  Close Request
                </button>
              )}

              {currentRole === 'Admin' && req.status === 'Closed' && (
                <button onClick={() => handleStatusUpdate(req._id, 'Reopened')} style={{ backgroundColor: 'purple', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>
                  Reopen Request
                </button>
              )}

            
              {!(
                (currentRole === 'Manager' && req.status === 'Submitted') ||
                (currentRole === 'User' && req.status === 'Needs Clarification') ||
                (currentRole === 'Admin' && (req.status === 'Approved' || req.status === 'Closed'))
              ) && <span style={{ color: '#999', italic: 'true', fontSize: '13px' }}>No actions available for your role on this status.</span>}

            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WorkflowRequest;
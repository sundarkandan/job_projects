
import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

 
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

     
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setSuccess(`Logged in successfully as ${data.user.role}!`);
    } catch (err) {
      setError(err.message);
    }
  };

 
  const fetchAdminDashboard = async () => {
    setError('');
    setDashboardData(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unauthorized access');
      }

      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setDashboardData(null);
    setError('');
    setSuccess('Logged out.');
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="text-center mb-4 text-primary">Backend Security Module Demo</h2>

  
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

   
      {!token ? (
        <div className="card shadow-sm p-4">
          <h4 className="card-title mb-3">Login</h4>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="form-text">Try: <b>anand@mail.com</b> (Admin) or <b>kumar@mail.com</b> (User)</div>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="form-text">Password length must be min 6 chars. (e.g., xyz123)</div>
            </div>
            <button type="submit" className="btn btn-primary w-100">Submit & Authenticate</button>
          </form>
        </div>
      ) : (
    
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5>Welcome, <b>{user?.name}</b></h5>
              <span className={`badge ${user?.role === 'Admin' ? 'bg-danger' : 'bg-secondary'}`}>
                Role: {user?.role}
              </span>
            </div>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
          </div>

          <hr />

        
          <div className="mt-3">
            <h6>Test Role-Based Middleware (RBAC):</h6>
            <p className="text-muted small">Only users with 'Admin' role can fetch data from the server endpoint.</p>
            <button className="btn btn-dark w-100 mb-3" onClick={fetchAdminDashboard}>
              Fetch Admin Protected Data
            </button>
          </div>


          {dashboardData && (
            <div className="p-3 bg-light border rounded mt-2">
              <h6 className="text-success">{dashboardData.message}</h6>
              <p className="small mb-1"><b>Sanitized Response from DB (No Passwords leaked):</b></p>
              <pre className="bg-dark text-white p-2 rounded small">
                {JSON.stringify(dashboardData.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
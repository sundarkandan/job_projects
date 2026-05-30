import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/dashboard');
      if (!response.ok) {
        throw new Error('Incomplete response from resource server.');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || 'An unexpected networking error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Active': 
        return { backgroundColor: '#e6f4ea', color: '#137333', fontSize: '0.85rem', fontWeight: '600' };
      case 'Pending': 
        return { backgroundColor: '#fef7e0', color: '#b06000', fontSize: '0.85rem', fontWeight: '600' };
      case 'Inactive': 
        return { backgroundColor: '#fce8e6', color: '#c5221f', fontSize: '0.85rem', fontWeight: '600' };
      default: 
        return { backgroundColor: '#f1f3f4', color: '#5f6368', fontSize: '0.85rem', fontWeight: '600' };
    }
  };

  return (
    <div className="container-fluid" style={{ fontFamily: '"Inter", "Segoe UI", sans-serif', backgroundColor: '#f8f9fa' }}>
      <div className="row" style={{ minHeight: '100vh' }}>
        
       
        <nav className="col-md-3 col-lg-2 d-md-block bg-white border-end sidebar p-0">
          <div className="position-sticky d-flex flex-column h-100">
            <div className="px-4 py-4 d-flex align-items-center border-bottom">
              <div className="bg-primary rounded-3 text-white d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px', fontWeight: 'bold' }}>D</div>
              <h5 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>DevPortal</h5>
            </div>
            
            <ul className="nav flex-column px-3 mt-4 flex-grow-1">
              <li className="nav-item mb-1">
                <a className="nav-link active rounded-3 px-3 py-2 text-primary fw-medium" href="#dashboard" style={{ backgroundColor: '#e8f0fe' }}>
                   <span className="ms-2">Dashboard</span>
                </a>
              </li>
              <li className="nav-item mb-1">
                <a className="nav-link text-secondary rounded-3 px-3 py-2 fw-medium" href="#projects">
                  <span className="ms-2">Projects</span>
                </a>
              </li>
              <li className="nav-item mb-1">
                <a className="nav-link text-secondary rounded-3 px-3 py-2 fw-medium" href="#users">
                  <span className="ms-2">Users</span>
                </a>
              </li>
              <li className="nav-item mb-1">
                <a className="nav-link text-secondary rounded-3 px-3 py-2 fw-medium" href="#settings">
                  <span className="ms-2">Settings</span>
                </a>
              </li>
            </ul>

            <div className="p-3 border-top bg-light">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px' }}>S</div>
                <div>
                  <h6 className="mb-0 small fw-bold text-dark">Sundar Dev</h6>
                  <span className="text-muted style" style={{ fontSize: '0.75rem' }}>Administrator</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

   
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-5 pt-4 pb-5">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-4 border-bottom">
            <div>
              <h1 className="h3 fw-bold text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>System Overview</h1>
              <p className="text-muted small mb-0">Real-time metrics monitoring panel.</p>
            </div>
            <div className="btn-toolbar mb-2 mb-md-0">
              <button type="button" className="btn btn-sm btn-white border shadow-sm px-3 fw-medium text-secondary" onClick={fetchDashboardData}>
                🔄 Sync Metrics
              </button>
            </div>
          </div>

          
          {loading && (
            <div>
              <div className="row mb-4">
                {[1, 2, 3].map((n) => (
                  <div className="col-md-4 mb-3" key={n}>
                    <div className="card border-0 shadow-sm p-4 placeholder-glow">
                      <div className="placeholder col-5 bg-light mb-3 rounded" style={{ height: '14px' }}></div>
                      <div className="placeholder col-8 bg-light rounded" style={{ height: '32px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card border-0 shadow-sm p-4 placeholder-glow">
                <div className="placeholder col-3 bg-light mb-4 rounded" style={{ height: '20px' }}></div>
                <div className="placeholder col-12 bg-light mb-2 rounded" style={{ height: '40px' }}></div>
                <div className="placeholder col-12 bg-light mb-2 rounded" style={{ height: '40px' }}></div>
                <div className="placeholder col-12 bg-light rounded" style={{ height: '40px' }}></div>
              </div>
            </div>
          )}

          
          {error && !loading && (
            <div className="card border-0 shadow-sm mb-4" style={{ borderLeft: '4px solid #dc3545' }}>
              <div className="card-body p-4 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="bg-danger-subtle rounded-circle p-2 text-danger me-3 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>⚠️</div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Data Pipeline Disrupted</h6>
                    <p className="mb-0 text-secondary small">{error}</p>
                  </div>
                </div>
                <button className="btn btn-sm btn-outline-danger px-4 fw-medium rounded-2" onClick={fetchDashboardData}>
                  Retry Sync
                </button>
              </div>
            </div>
          )}

        
          {!loading && !error && data && (
            <>
              
              <div className="row mb-4">
                <div className="col-md-4 mb-3">
                  <div className="card border-0 shadow-sm h-100 p-2 bg-white">
                    <div className="card-body">
                      <span className="text-secondary fw-semibold small text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>Total System Users</span>
                      <h2 className="fw-bold text-dark mt-2 mb-0" style={{ letterSpacing: '-1px' }}>{data.stats.totalUsers.toLocaleString()}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-0 shadow-sm h-100 p-2 bg-white">
                    <div className="card-body">
                      <span className="text-secondary fw-semibold small text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>Active Workspace Projects</span>
                      <h2 className="fw-bold text-dark mt-2 mb-0" style={{ letterSpacing: '-1px' }}>{data.stats.activeProjects}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-0 shadow-sm h-100 p-2 bg-white">
                    <div className="card-body">
                      <span className="text-secondary fw-semibold small text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>Net Monthly Run-Rate</span>
                      <h2 className="fw-bold text-primary mt-2 mb-0" style={{ letterSpacing: '-1px' }}>{data.stats.revenue}</h2>
                    </div>
                  </div>
                </div>
              </div>

           
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
                <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between">
                  <h6 className="mb-0 fw-bold text-dark">Recent Pipeline Activities</h6>
                  <span className="badge bg-light text-dark border fw-medium px-2 py-1" style={{ fontSize: '0.75rem' }}>Live Feed</span>
                </div>
                <div className="table-responsive">
                  <table className="table table-borderless table-hover align-middle mb-0">
                    <thead className="table-light border-bottom" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <tr>
                        <th className="px-4 text-secondary py-3">#</th>
                        <th className="text-secondary py-3">Team Member</th>
                        <th className="text-secondary py-3">Operations Domain</th>
                        <th className="px-4 text-end text-secondary py-3">Allocation Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentActivities.map((activity, index) => (
                        <tr key={activity.id} className="border-bottom" style={{ transition: 'all 0.2s ease' }}>
                          <td className="px-4 text-muted small">{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-light rounded-circle text-secondary d-flex align-items-center justify-content-center me-2 fw-medium" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                                {activity.name.charAt(0)}
                              </div>
                              <span className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>{activity.name}</span>
                            </div>
                          </td>
                          <td className="text-secondary" style={{ fontSize: '0.9rem' }}>{activity.task}</td>
                          <td className="px-4 text-end">
                         
                            <span className="badge px-3 py-1.5 rounded-2 d-inline-block" style={getBadgeStyle(activity.status)}>
                              {activity.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;
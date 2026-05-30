import React, { useEffect, useState } from "react";
import axios from "axios"
const CRUD = () => {

  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    description: "",
    category: "",
    priority: "Low", 
  });
useEffect(()=>{
axios.post('http://localhost:3000/requests').then((res)=>{
        setList(res.data.finding)
    })
},[])

  const [list, setList] = useState([]);

  const [editIndex, setEditIndex] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit =async (e) => {
    e.preventDefault();
    

    if (!formData.userId || !formData.title || !formData.description || !formData.category) {
      alert("Please fill all the fields!");
      return;
    }

    await axios.post('http://localhost:3000/requests',formData).then((res)=>{
        alert(res.data.msg)
        setList(res.data.finding)
    })

    setFormData({
      userId: "",
      title: "",
      description: "",
      category: "",
      priority: "Low",
    });
  };




  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High": return "bg-danger";
      case "Medium": return "bg-warning text-dark";
      default: return "bg-success";
    }
  };

  return (
    <div className="container my-5">
      <div className="row g-4">
        

        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white py-3">
              <h5 className="card-title mb-0">
                {editIndex !== null ? "Edit Task / Entry" : "Create New Entry"}
              </h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                
                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">User ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="userId"
                    placeholder="Enter User ID"
                    value={formData.userId}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    placeholder="Enter Title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    placeholder="e.g., Development, Design"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Priority</label>
                  <select
                    className="form-select"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-secondary">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    placeholder="Enter Description..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-dark w-100 fw-bold py-2">
                 Submit
                </button>
                
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-light py-3 border-bottom-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-dark fw-bold">Data Records</h5>
              <span className="badge bg-secondary">Total Items {list.length} </span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-secondary small text-uppercase">
                    <tr>
                      <th className="px-4 py-3">User ID</th>
                      <th className="py-3">Title / Description</th>
                      <th className="py-3">Category</th>
                      <th className="py-3">Priority</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {list.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">
                          <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                          No records found. Add an entry to populate the table.
                        </td>
                      </tr>
                    ) : (
                      list.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 fw-bold text-dark">{item.userId}</td>
                          <td>
                            <div className="fw-semibold text-dark">{item.title}</div>
                            <small className="text-muted d-block text-truncate" style={{ maxWidth: "250px" }}>
                              {item.description}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">{item.category}</span>
                          </td>
                          <td>
                            <span className={`badge ${getPriorityBadge(item.priority)}`}>
                              {item.priority}
                            </span>
                          </td>
                         
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CRUD;
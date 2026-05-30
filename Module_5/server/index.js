const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


const mockRequests = [
  { id: 1, title: "Laptop Repair", user: "John", category: "IT", status: "Submitted", date: "2026-05-10" },
  { id: 2, title: "Software License", user: "John", category: "IT", status: "Approved", date: "2026-05-12" },
  { id: 3, title: "Office Chair", user: "Sarah", category: "Facilities", status: "Submitted", date: "2026-05-15" },
  { id: 4, title: "Marketing Budget", user: "Mike", category: "Finance", status: "Rejected", date: "2026-05-18" },
  { id: 5, title: "Travel Reimbursement", user: "Sarah", category: "Finance", status: "Submitted", date: "2026-05-20" },
  { id: 6, title: "Monitor Upgrade", user: "John", category: "IT", status: "Approved", date: "2026-05-22" },
  { id: 7, title: "AC Maintenance", user: "Admin", category: "Facilities", status: "Submitted", date: "2026-05-25" },
];


const processRequests = (requests, req) => {
  let { status, category, startDate, endDate, page = 1, limit = 3 } = req.query;
  let filtered = [...requests];

  if (status) filtered = filtered.filter(r => r.status === status);
  if (category) filtered = filtered.filter(r => r.category === category);
  if (startDate && endDate) {
    filtered = filtered.filter(r => r.date >= startDate && r.date <= endDate);
  }


  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + parseInt(limit));

  return {
    data: paginatedData,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems
    }
  };
};


app.get('/my-requests', (req, res) => {
  const userRequests = mockRequests.filter(r => r.user === "John");
  res.json(processRequests(userRequests, req));
});

app.get('/requests', (req, res) => {
  
  res.json(processRequests(mockRequests, req));
});

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
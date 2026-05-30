const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


app.get('/api/dashboard', (req, res) => {
   
    const simulateError = Math.random() < 0.15;
    if (simulateError) {
        return res.status(500).json({ message: "Internal Server Error! Failed to fetch dashboard data." });
    }

    
    const dashboardData = {
        stats: {
            totalUsers: 1240,
            activeProjects: 42,
            revenue: "$15,230"
        },
        recentActivities: [
            { id: 1, name: "Rajesh Kumar", task: "MERN Stack Dev", status: "Active" },
            { id: 2, name: "Anitha R", task: "UI/UX Design", status: "Pending" },
            { id: 3, name: "Suresh M", task: "Bug Fixing", status: "Inactive" },
            { id: 4, name: "Deepika K", task: "Database Setup", status: "Active" }
        ]
    };


    setTimeout(() => {
        res.json(dashboardData);
    }, 2000);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/workflowDB')
  .then(async () => {
    console.log('MongoDB Connected Successfully');
    
   
    const count = await Request.countDocuments();
    if (count === 0) {
      await Request.create({
        title: "Medical Leave Request",
        description: "Need leave for 2 days due to fever.",
        status: "Submitted" 
      });
      console.log('Test Request Data Seeded successfully!');
    }
  })
  .catch(err => console.error('MongoDB Connection Error:', err));


const RequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Submitted', 'Approved', 'Rejected', 'Needs Clarification', 'Closed', 'Reopened'],
    default: 'Submitted' 
  }
}, { timestamps: true });

const Request = mongoose.model('Request', RequestSchema);


const ALLOWED_TRANSITIONS = {
  'Submitted': {
    'Manager': ['Approved', 'Rejected', 'Needs Clarification']
  },
  'Needs Clarification': {
    'User': ['Submitted']
  },
  'Approved': {
    'Admin': ['Closed']
  },
  'Closed': {
    'Admin': ['Reopened']
  }
};


const getRoleFromHeader = (req, res, next) => {
  const userRole = req.headers['x-user-role']; 
  if (!userRole) {
    return res.status(400).json({ message: 'User role is missing in headers!' });
  }
  req.userRole = userRole;
  next();
};


app.get('/api/requests', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.patch('/api/requests/:id/status', getRoleFromHeader, async (req, res) => {
  try {
    const { id } = req.params;
    const { status: targetStatus } = req.body; 
    const userRole = req.userRole;             

   
    const requestItem = await Request.findById(id);
    if (!requestItem) {
      return res.status(404).json({ message: 'Request found aagala!' });
    }

    const currentStatus = requestItem.status;

    const roleRules = ALLOWED_TRANSITIONS[currentStatus];
    if (!roleRules) {
      return res.status(400).json({ message: `${currentStatus}-la irundhu ini status-ah maatha mudiyathu!` });
    }

    const allowedStatuses = roleRules[userRole];
    if (!allowedStatuses || !allowedStatuses.includes(targetStatus)) {
      return res.status(403).json({ 
        message: `Anumadhi Illai! Oru ${userRole}-ala status-ah '${currentStatus}' la irundhu '${targetStatus}' ku maatha mudiyathu.` 
      });
    }

   
    requestItem.status = targetStatus;
    await requestItem.save();

    res.status(200).json({ message: 'Status updated successfully!', data: requestItem });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors()); 
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/action_log_db')
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));


const RequestLogSchema = new mongoose.Schema({
  request_id: { type: String, required: true, index: true },
  old_status: { type: String, default: null },
  new_status: { type: String, required: true },
  changed_by: { type: String, required: true },
  role: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const RequestLog = mongoose.model('RequestLog', RequestLogSchema);


app.get('/requests/:id/logs', async (req, res) => {
  try {
    const logs = await RequestLog.find({ request_id: req.params.id })
                                 .sort({ timestamp: -1 }); 
    res.json({ request_id: req.params.id, logs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs", error });
  }
});

app.post('/requests/:id/logs', async (req, res) => {
  try {
    const newLog = new RequestLog({
      request_id: req.params.id,
      old_status: req.body.old_status,
      new_status: req.body.new_status,
      changed_by: req.body.changed_by,
      role: req.body.role
    });
    await newLog.save();
    res.status(201).json({ message: "Log added successfully", newLog });
  } catch (error) {
    res.status(400).json({ message: "Error creating log", error });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
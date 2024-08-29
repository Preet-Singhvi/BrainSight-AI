const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const connectDB = require('./dbconnection/dbconnection');
const WebSocket = require('ws');
const Patient = require('./models/patient');

require('dotenv').config();

const app = express();
const ws = new WebSocket.Server({ port: 8080 });
app.use(cors());
app.use(bodyParser.json());

function broadcast(data) {
  ws.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}


ws.on('connection', io => {
  console.log('A new client connected');

  io.on('close', () => {
    console.log('Client disconnected');
  });
}); 

app.use('/files',express.static(process.env.FILES_DIR || "files"));

connectDB()


app.get('/', (req, res) => {
  res.send('A BrainSight AI Assignment');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './files');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

app.post('/patients', upload.array('files'), async (req, res) => {
  try {
    const { patient_name, age, sex, condition, processing_status } = req.body;
    const patient_id = Date.now() + '-' + Math.floor(Math.random() * 10000);
    const filenames = req.files.map(file => file.filename);
    const patient = new Patient({
      patient_id,
      patient_name,
      age,
      sex,
      condition,
      filenames,
      processing_status
    });

    await patient.save();
    res.status(200).send(patient);
    broadcast({ type: 'Updated', payload: patient });
  } catch (error) {
    console.error('Error saving patient details:', error);
    res.status(500).send('Error saving patient details');
  }
});

app.post('/ws', (req, res) => {
  const message = req.body.message;
  broadcast({ type: 'Message', payload: message });
  res.status(200).send('Message sent to WebSocket clients');
});

app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = `${__dirname}/files/${filename}`;

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file');
    }
  });
});

app.put('/patients/:id', upload.array('files'), async (req, res) => {
  try {
    const patient_id = req.params.id;

    const { age, sex, condition, processing_status } = req.body;
    const updateFields = {};
    if (age !== undefined) updateFields.age = age;
    if (sex !== undefined) updateFields.sex = sex;
    if (condition !== undefined) updateFields.condition = condition;
    if (processing_status !== undefined) updateFields.processing_status = processing_status;

    const existingPatient = await Patient.findOne({ patient_id });
    if (!existingPatient) {
      return res.status(404).send('Patient not found');
    }

    if (req.files && req.files.length > 0) {
      const existingFilenames = existingPatient.filenames || [];
      const newFilenames = req.files.map(file => file.filename);
      updateFields.filenames = [...new Set([...existingFilenames, ...newFilenames])];
    } else {
      updateFields.filenames = existingPatient.filenames;
    }

    const updatedPatient = await Patient.findOneAndUpdate(
      { patient_id },
      updateFields,
      { new: true }
    );

    res.status(200).send(updatedPatient);
  } catch (error) {
    console.error('Error updating patient details:', error);
    res.status(500).send('Error updating patient details');
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
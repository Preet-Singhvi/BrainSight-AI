const express = require('express');
const multer = require('multer');
const Patient = require('../models/patient');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './files');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.post('/patients', upload.array('files'), async (req, res) => {
  try {
    const { patient_name, age_sex, condition, fileProcess} = req.body;
    const patient_id = Date.now() + '-' + Math.floor(Math.random() * 10000);
    const filenames = req.files.map(file => file.filename);
    const patient = new Patient({
      patient_id,
      patient_name,
      age_sex,
      condition,
      filenames
    });

    await patient.save();
    res.status(200).send(patient);
  } catch (error) {
    console.error('Error saving patient details:', error);
    res.status(500).send('Error saving patient details');
  }
});

router.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = `${__dirname}/../files/${filename}`;

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file');
    }
  });
});

router.put('/patients/:id', upload.array('files'), async (req, res) => {
  try {
    const patient_id = req.params.id;

    const { age, condition } = req.body;
    const updateFields = {};
    if (age !== undefined) updateFields.age = age;
    if (condition !== undefined) updateFields.condition = condition;

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

module.exports = router;
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patient_id: { type: String, required: true, unique: true },
    patient_name: { type: String, required: true },
    age_sex: { type: String, required: true },
    condition: { type: String, required: true },
    dateOfUpload: { type: Date, default: Date.now },
    filenames: [String],
    processing_status: { type: String, required: true }
});

module.exports = mongoose.model('Patient', patientSchema);
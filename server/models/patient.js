const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patient_id: { type: String, required: true, unique: true }, // Ensure patient_id is unique and required
    patient_name: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    condition: { type: String, required: true },
    dateOfUpload: { type: Date, default: Date.now },
    filenames: [String],
    processing_status: { type: String, required: true } // Ensure processing_status is required
});

module.exports = mongoose.model('Patient', patientSchema);
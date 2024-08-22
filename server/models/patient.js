const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patient_id: String,
    patient_name: String,
    age_sex: String,
    condition: String,
    dateOfUpload: { type: Date, default: Date.now },
    filenames: [String]
});

module.exports = mongoose.model('Patient', patientSchema);
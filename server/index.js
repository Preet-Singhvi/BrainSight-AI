const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./dbconnection/dbconnection');
const patientRoutes = require('./routes/patient');
require('dotenv').config();

// Initialize Express app,initialize cors and body-parser
const app = express();
app.use(cors());
app.use(bodyParser.json());

//Making all the pdf files accessible
app.use('/files',express.static(process.env.FILES_DIR || "files"));

// Connect to local MongoDB
connectDB()

//patient api's
app.use(patientRoutes);


// Root route to return a simple message
app.get('/', (req, res) => {
  res.send('A BrainSight AI Assignment');
});


// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
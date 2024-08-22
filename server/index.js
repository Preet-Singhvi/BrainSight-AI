const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./dbconnection/dbconnection');
const patientRoutes = require('./routes/patient');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/files',express.static(process.env.FILES_DIR || "files"));

connectDB()

app.use(patientRoutes);


app.get('/', (req, res) => {
  res.send('A BrainSight AI Assignment');
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
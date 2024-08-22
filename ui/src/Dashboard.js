import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { AddPatients, GetPatients } from "./Service/Service.Patient";
import PatientDialog from "./Dialogs/PatientDialog/PatientDialog";
import { useDispatch } from "react-redux";
import { SetFilesDialog, SetPatientDialog, SetViewFiles } from "./Redux/action";
import { toast } from 'react-toastify';
import FilesDialog from "./Dialogs/FilesDialog/FilesDialog";

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient_name: "",
    age: "",
    condition: "",
  });
  const [afiles, setFiles] = useState([]);
  const dispatch = useDispatch();

  // Fetch all patients
  useEffect(() => {
    const fetchPatients = () => {
      GetPatients()
        .then((response) => {
          setPatients(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the patients!", error);
          toast.error("Failed to get patients details. Please try after some time.");
        });
    };

    fetchPatients();

    const intervalId = setInterval(fetchPatients, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    if (type === "file") {
      setFiles(event.target.files);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("patient_name", form.patient_name);
    formData.append("age_sex", form.age_sex);
    formData.append("condition", form.condition);

    for (let file of afiles) {
      formData.append("files", file);
    }

    AddPatients(formData)
      .then((response) => {
        setPatients([...patients, response.data]);
        setForm({ patient_name: "", age: "", condition: "" });
        setFiles([]);
        dispatch(SetPatientDialog(false));
        toast.success("Patient added successfully!"); 
      })
      .catch((error) => {
        console.error("There was an error adding the patient!", error);
        toast.error("Failed to add patient. Please try again.");
      });
  };

  const handleClickOpen = () => {
    setForm({ patient_name: "", age: "", condition: "" });
    setFiles([]);
    dispatch(SetPatientDialog(true));
  };

  const handleClose = () => {
    dispatch(SetPatientDialog(false));
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "do MMM, yyyy h:mm a", { locale: enUS });
  };

  const FileProcessTableCell = (patient) => {
    const isCompleted = patient.filenames && patient.filenames.length > 0;

    return (
      <TableCell>
        <Typography style={{
          backgroundColor: isCompleted ? "#4CAF50" : "#B0BEC5",
          color: "white",
          borderRadius: "8px",
          padding: "8px",
          textAlign: "center",
        }}>
        {isCompleted ? "Completed" : "Yet To Start"}
        </Typography>
      </TableCell>
    );
  };

  return (
    <Container style={{ backgroundColor: "#2C2C2C", color: "#FFFFFF", padding: "20px", borderRadius: "10px", maxHeight:'100%', maxWidth:'100%'}}>
      <Typography variant="h4" align="center" gutterBottom style={{ color: "#E0E0E0", marginBottom: "20px" }}>
        Patient Dashboard
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
        style={{ marginBottom: "20px", backgroundColor: "#1E88E5", color: "#FFF" }}
      >
        Add Patient
      </Button>

      <div style={{ marginTop: "24px" }}>
        {patients.map((patient) => (
          <Accordion
            key={patient._id}
            style={{
              backgroundColor: "#424242",
              color: "#FFFFFF",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: "#FFFFFF" }} />}
            >
              {patient.filenames && patient.filenames.length > 0 ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="https://uat-vbexplore.brainsightai.com/img/completed_accordin_icon.466363ec.svg"
                    alt="Completed Icon"
                    style={{ marginRight: 8 }}
                  />
                  <Typography variant="body2" style={{ color: "#A5D6A7" }}>
                    Completed Uploads
                  </Typography>
                </div>
              ) : (
                <Typography variant="body2" style={{ color: "#E57373" }}>
                  No Uploads
                </Typography>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} style={{ backgroundColor: "#303030" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ color: "#B0BEC5" }}>Patient ID</TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>Patient Name</TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>Age, Sex</TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>Condition</TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>Date of Upload</TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>Files Uploaded</TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>Processing Status</TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ color: "#E0E0E0" }}>{patient.patient_id}</TableCell>
                      <TableCell style={{ color: "#E0E0E0" }}>{patient.patient_name}</TableCell>
                      <TableCell style={{ color: "#E0E0E0" }}>{patient.age_sex}</TableCell>
                      <TableCell style={{ color: "#E0E0E0" }}>{patient.condition}</TableCell>
                      <TableCell style={{ color: "#E0E0E0" }}>{formatDate(patient.dateOfUpload)}</TableCell>
                      <TableCell style={{ color: "#E0E0E0" }}>
                        {patient.filenames && patient.filenames.join(" | ")}
                      </TableCell>
                      {FileProcessTableCell(patient)}
                      <TableCell>
                        <Button
                          onClick={() => {
                            dispatch(SetFilesDialog(true));
                            dispatch(SetViewFiles(patient));
                          }}>
                        <img
                          src="https://uat-vbexplore.brainsightai.com/img/report_icon2.edf631e0.svg"
                          alt="View Files Icon"
                          style={{ marginRight: 8 }}
                        />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      <PatientDialog
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      />
      <FilesDialog />
    </Container>
  );
};

export default Dashboard;

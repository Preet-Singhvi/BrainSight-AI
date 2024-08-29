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
  Tooltip,
  Box,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { AddPatients, GetPatients } from "./Service/Service.Patient";
import PatientDialog from "./Dialogs/PatientDialog/PatientDialog";
import { useDispatch } from "react-redux";
import { SetFilesDialog, SetPatientDialog, SetViewFiles } from "./Redux/action";
import { toast } from "react-toastify";
import FilesDialog from "./Dialogs/FilesDialog/FilesDialog";

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [form, setForm] = useState({
    patient_name: "",
    age: "",
    sex: "",
    condition: "",
  });
  const [afiles, setFiles] = useState([]);
  const [filter, setFilter] = useState("");
  const dispatch = useDispatch();

  // Fetch all patients
  const fetchPatients = () => {
    GetPatients()
      .then((response) => {
        setPatients(response.data);
        setFilteredPatients(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the patients!", error);
        toast.error(
          "Failed to get patients details. Please try after some time."
        );
      });
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/ws');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'Updated') {
        fetchPatients()
      }
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.reason);
    }

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {

    fetchPatients();

    const intervalId = setInterval(fetchPatients, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (filter) {
      setFilteredPatients(
        patients.filter((patient) =>
          patient.patient_name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      setFilteredPatients(patients);
    }
  }, [filter, patients]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
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
    formData.append("age", form.age);
    formData.append("sex", form.sex);
    formData.append("condition", form.condition);
    const processingStatus = afiles.length > 0 ? "Completed" : "Yet To Start";
    formData.append("processing_status", processingStatus);
    for (let file of afiles) {
      formData.append("files", file);
    }

    AddPatients(formData)
      .then((response) => {
        setPatients([...patients, response.data]);
        setForm({ patient_name: "", age: "", sex: "", condition: "" });
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
    setForm({ patient_name: "", age: "", sex: "", condition: "" });
    setFiles([]);
    dispatch(SetPatientDialog(true));
  };

  const handleClose = () => {
    dispatch(SetPatientDialog(false));
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const clearFilter = () => {
    setFilter("");
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "do MMM, yyyy h:mm a", { locale: enUS });
  };

  const FileProcessTableCell = (patient) => {
    const status = patient.processing_status;

    let backgroundColor;
    let textColor = "white";

    switch (status) {
      case "Yet To Start":
        backgroundColor = "#B0BEC5";
        break;
      case "Processing":
        backgroundColor = "#FFEB3B";
        break;
      case "Completed":
        backgroundColor = "#4CAF50";
        break;
      case "Failed":
        backgroundColor = "#F44336";
        break;
      default:
        backgroundColor = "#B0BEC5";
    }

    return (
      <TableCell>
        <Typography
          style={{
            backgroundColor,
            color: textColor,
            borderRadius: "8px",
            padding: "8px",
            textAlign: "center",
          }}
        >
          {status}
        </Typography>
      </TableCell>
    );
  };

  return (
    <Container
      style={{
        backgroundColor: "#2C2C2C",
        color: "#FFFFFF",
        padding: "20px",
        borderRadius: "10px",
        maxHeight: "100%",
        maxWidth: "100%",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "#E0E0E0", marginBottom: 4 }}
      >
        Patient Dashboard
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        gap="10px"
        mb={2}
      >
        <TextField
          label="Filter by Patient Name"
          size="small"
          value={filter}
          onChange={handleFilterChange}
          sx={{
            width: 200,
            height: 40,
            borderRadius: 0,
            backgroundColor: "#3c3c3c",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#444",
              },
              "&:hover fieldset": {
                borderColor: "#777",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#777",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#ccc",
              "&.Mui-focused": {
                color: "#ccc !important",
              },
            },
            "& .MuiInputBase-input": {
              color: "#ccc",
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={clearFilter}
          style={{
            height: "40px",
          }}
        >
          Clear Filter
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          style={{
            height: "40px",
          }}
        >
          Add Patient
        </Button>
      </Box>

      <div style={{ marginTop: "24px" }}>
        {filteredPatients.map((patient) => (
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
              <TableContainer
                component={Paper}
                style={{ backgroundColor: "#303030" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ color: "#B0BEC5" }}>
                        Patient ID
                      </TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>
                        Patient Name
                      </TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>
                        Age, Sex
                      </TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>
                        Condition
                      </TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>
                        Date of Upload
                      </TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>
                        Files Uploaded
                      </TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>
                        Processing Status
                      </TableCell>
                      <TableCell style={{ color: "#B0BEC5" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ color: "#E0E0E0" }}>
                        {patient.patient_id}
                      </TableCell>
                      <TableCell style={{ color: "#E0E0E0" }}>
                        {patient.patient_name}
                      </TableCell>
                      <TableCell style={{ color: "#E0E0E0" }}>
                        {`${patient.age}, ${patient.sex}`}
                      </TableCell>
                      <TableCell style={{ color: "#E0E0E0" }}>
                        {patient.condition}
                      </TableCell>
                      <TableCell style={{ color: "#E0E0E0" }}>
                        {formatDate(patient.dateOfUpload)}
                      </TableCell>
                      <TableCell style={{ color: "#E0E0E0" }}>
                        {patient.filenames && patient.filenames.join(" | ")}
                      </TableCell>
                      {FileProcessTableCell(patient)}
                      <TableCell>
                        <Tooltip title="View Files">
                          <Button
                            onClick={() => {
                              dispatch(SetFilesDialog(true));
                              dispatch(SetViewFiles(patient));
                            }}
                          >
                            <img
                              src="https://uat-vbexplore.brainsightai.com/img/report_icon2.edf631e0.svg"
                              alt="View Files Icon"
                              style={{ marginRight: 8 }}
                            />
                          </Button>
                        </Tooltip>
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
      <FilesDialog patients={patients} setPatients={setPatients} />
    </Container>
  );
};

export default Dashboard;

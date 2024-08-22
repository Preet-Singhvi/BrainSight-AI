import { useDispatch, useSelector } from "react-redux";
import { FilesDialogOpen, ViewFiles } from "../../Redux/reducer";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Tooltip,
} from "@mui/material";
import { SetFilesDialog, SetViewFiles } from "../../Redux/action";
import { toast } from "react-toastify";
import "./FilesDialog.css";
import { UpdatePatientById } from "../../Service/Service.Patient";

const FilesDialog = (props) => {
  const rsFilesDialog = useSelector(FilesDialogOpen);
  const rsViewFiles = useSelector(ViewFiles);
  const [aFileNames, setFileNames] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploaded, setUploaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setFileNames(rsViewFiles?.filenames);
  }, [rsViewFiles, selectedFiles]);

  const handleClose = () => {
    dispatch(SetViewFiles(null));
    setUploaded(false);
    dispatch(SetFilesDialog(false));
  };

  const handleFileChange = (event) => {
    setUploaded(true);
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append("files", file);
    }
    const processingStatus = selectedFiles.length > 0 ? "Completed" : "Yet To Start";
    formData.append("processing_status", processingStatus);
    try {
      UpdatePatientById(rsViewFiles.patient_id, formData)
        .then((response) => {
          const updatedFilenames = [...aFileNames, ...response.data.filenames]; 
          const processingStatus = updatedFilenames.length > 0 ? "Completed" : "Yet To Start";
          props.setPatients(prevPatients =>
            prevPatients.map(patient =>
              patient.patient_id === rsViewFiles.patient_id
                ? { ...patient, filenames: updatedFilenames, processing_status: processingStatus }
                : patient
            )
          );
          setSelectedFiles([]);
          dispatch(SetFilesDialog(false));
          setUploaded(false);
          toast.success("Patient updated successfully!");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to update patient. Please try again.");
        });
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <Dialog open={rsFilesDialog} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Files</DialogTitle>
      <DialogContent className="dialog-content">
        <DialogContentText className="dialog-content-text">
          {aFileNames && aFileNames.length > 0 ? (
            aFileNames.map((filename, index) => (
              <div key={index} className="file-item">
                <span className="file-name">{filename}</span>
                <div className="file-actions">
                  <Tooltip title="Download PDF">
                    <Button
                      href={`http://localhost:8000/download/${filename}`}
                      download
                      variant="contained"
                      color="primary"
                      startIcon={
                        <img
                          src="https://uat-vbexplore.brainsightai.com/img/download_icon2.f75eb645.svg"
                          alt="Download Icon"
                          style={{ width: 24, height: 24 }}
                        />
                      }
                    ></Button>
                  </Tooltip>
                  <Tooltip title="View PDF">
                    <Button
                      onClick={() => {
                        window.open(
                          `http://localhost:8000/files/${filename}`,
                          "_blank",
                          "noreferrer"
                        );
                      }}
                      variant="contained"
                    >
                      View
                    </Button>
                  </Tooltip>
                </div>
              </div>
            ))
          ) : (
            <p>No files available</p>
          )}
        </DialogContentText>
        <div className="upload-section">
          <input
            type="file"
            class="form-control"
            accept="application/pdf"
            name="files"
            multiple
            onChange={handleFileChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleUpload}
          color="primary"
          variant="contained"
          className="upload-button"
          disabled={!isUploaded}
        >
          Save
        </Button>
        <Button
          onClick={handleClose}
          color="primary"
          variant="contained"
          className="cancel-button"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilesDialog;

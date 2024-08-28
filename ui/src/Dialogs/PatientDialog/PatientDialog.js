import { useSelector } from "react-redux";
import { PatientDialogOpen } from "../../Redux/reducer";
import React from "react";
import {
  TextField,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import './PatientDialog.css'

const PatientDialog = (props) => {
  const rsPatientDialog = useSelector(PatientDialogOpen);
  const { form, handleChange, handleSubmit, handleClose } = props;

  return (
    <Dialog open={rsPatientDialog} onClose={handleClose}>
      <DialogTitle className="dialog">{"Add New Patient"}</DialogTitle>
      <DialogContent className="dialog">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} marginTop={0.1}>
            <Grid item xs={12}>
              <TextField
                label="Patient Name"
                name="patient_name"
                variant="outlined"
                className="text-field"
                fullWidth
                value={form.patient_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Age"
                name="age"
                variant="outlined"
                type="number"
                className="text-field"
                fullWidth
                value={form.age}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Sex"
                name="sex"
                variant="outlined"
                className="text-field"
                fullWidth
                value={form.sex}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Condition"
                name="condition"
                variant="outlined"
                className="text-field"
                fullWidth
                value={form.condition}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} className="upload-section">
              <Typography>
                <bold>Upload New Files:</bold>
              </Typography>
              <input
                type="file"
                class="form-control"
                accept="application/pdf"
                name="files"
                multiple
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="submit-button"
                fullWidth
              >
                {"Add Patient"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions className="dialog">
        <Button onClick={handleClose} variant="outlined" color="primary" className="cancel-button">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default PatientDialog;

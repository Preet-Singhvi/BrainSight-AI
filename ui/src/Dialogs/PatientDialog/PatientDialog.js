import { useSelector } from "react-redux";
import { PatientDialogOpen } from "../../Redux/reducer";
import React from "react";
import {
  TextField,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const PatientDialog = (props) => {
  const rsPatientDialog = useSelector(PatientDialogOpen);
  const { form, handleChange, handleSubmit, handleClose } = props;

  return (
    <Dialog open={rsPatientDialog} onClose={handleClose}>
      <DialogTitle>{"Add New Patient"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} marginTop={0.1}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Patient Name"
                name="patient_name"
                variant="outlined"
                fullWidth
                value={form.patient_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                name="age"
                variant="outlined"
                type="number"
                fullWidth
                value={form.age}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sex"
                name="sex"
                variant="outlined"
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
                fullWidth
                value={form.condition}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
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
                fullWidth
              >
                {"Add Patient"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default PatientDialog;
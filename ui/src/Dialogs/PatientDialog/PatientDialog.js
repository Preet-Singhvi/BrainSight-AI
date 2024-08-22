import { useSelector } from "react-redux";
import { PatientDialogOpen } from "../../Redux/reducer";
import React from 'react';
import {
  TextField,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const PatientDialog = (props) => {
    const rsPatientDialog = useSelector(PatientDialogOpen)
    const {form,handleChange,handleSubmit,handleClose} = props

    return (
        <Dialog open={rsPatientDialog} onClose={handleClose}>
        <DialogTitle>
            {"Add New Patient"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                {"Fill in the details of the new patient."}
            </DialogContentText>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                <Grid item xs={12}>
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
                    label="Age, Sex"
                    name="age_sex"
                    variant="outlined"
                    fullWidth
                    value={form.age_sex}
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
            <Button onClick={handleClose} color="primary">
            Cancel
            </Button>
        </DialogActions>
        </Dialog>
    );
};
export default PatientDialog;
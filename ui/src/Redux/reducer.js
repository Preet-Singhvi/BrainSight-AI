import { createReducer } from '@reduxjs/toolkit';
import { SetFilesDialog, SetPatientDialog, SetViewFiles } from './action';

const initialState = {
    PatientDialog: false,
    FilesDialog: false,
    ViewFiles: null
}

export const DialogReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(SetPatientDialog, (state, action) => {
            return {
                ...state,
                PatientDialog: action.payload
            }
        })
        .addCase(SetFilesDialog, (state, action) => {
            return {
                ...state,
                FilesDialog: action.payload
            }
        })
        .addCase(SetViewFiles, (state, action) => {
            return {
                ...state,
                ViewFiles: action.payload
            }
        })
})

export const PatientDialogOpen = (state) => state.DialogState.PatientDialog 
export const FilesDialogOpen = (state) => state.DialogState.FilesDialog 
export const ViewFiles = (state) => state.DialogState.ViewFiles 
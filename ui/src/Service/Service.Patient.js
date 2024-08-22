import axios from 'axios'

export const GetPatients = () => {
    return new Promise((resolve, reject) => {
        return axios(
            `http://localhost:8000/patients`,
            {
                method:'GET'
            }
        ).then((response) => {
            resolve(response)
        })
        .catch((error) => {
            reject(error.message)
        })
    })
} 

export const AddPatients = (PatientDetails) => {
    return new Promise((resolve, reject) => {
        return axios(
            `http://localhost:8000/patients`,
            {
                method:'POST',
                data:PatientDetails,
                headers:{ 'Content-Type':'multipart/form-data' }
            }
        ).then((response) => {
            resolve(response)
        })
        .catch((error) => {
            reject(error.message)
        })
    })
} 


export const UpdatePatientById = (PatientId, PatientDetails) => {
    return new Promise((resolve, reject) => {
        return axios(
            `http://localhost:8000/patients/${PatientId}`,
            {
                method:'PUT',
                data:PatientDetails,
                headers:{ 'Content-Type':'multipart/form-data' }
            }
        ).then((response) => {
            resolve(response)
        })
        .catch((error) => {
            reject(error.message)
        })
    })
} 
## Patient Management Backend

This Node.js backend application handles patient data, including secure file uploads, patient information storage, and access to uploaded files. The application is built with Express.js, MongoDB, and follows best practices for security and scalability.

# Features
1. Patient Data Management: Create, update, and retrieve patient information.
2. File Upload: Upload multiple files associated with a patient record.
3. Secure File Access: Serve stored files securely via a static endpoint.
4. Robust Security: Implemented security practices including CORS.
5. Modular Design: Separation of concerns with dedicated modules for routing, database connection, and configuration.

# Installation
1. Prerequisites:
	Node.js
	MongoDB

# Steps:
1. Clone the repository:
	1. git clone https://github.com/Preet-Singhvi/BrainSight-AI.git
	2. cd BrainSight-AI/server
2. Install Dependencies:
	npm install
3. Set up MongoDB:
	Ensure MongoDB is running locally or set up a remote MongoDB instance.
4. Create a .env file in the root directory and configure your environment variables (see below).
5. node index.js

# Environment Variables
The application uses environment variables for configuration. Create a .env file in the root directory and add the following variables:
	1. PORT=8000
	2. MONGO_URL=mongodb+srv://preetsinghvi1:3DFlOA9C1fvJBDQ4@cluster0.comep.mongodb.net/patientDB?retryWrites=true&w=majority&appName=Cluster0
	3. FILES_DIR=files

# Usage
Once the server is running, you can interact with the API through tools like Postman or cURL.

# Example Requests
	Add a Patient: POST /api/patients
	Get All Patients: GET /api/patients
	Update Patient Info: PUT /api/patients/:id

# API Endpoints
1. POST /api/patients
	Description: Create a new patient record with associated files.
	Request Body:
		patient_name (String) - Required.
		age(Number) - Required.
		se(String) - Required.
		condition (String) - Required.
		Files: Multiple files can be uploaded.
		processing_status(String) - Required.
	Response:
		200 OK on success, with patient details in the response body.
2. GET /api/patients
	Description: Retrieve all patient records.
	Response:
		200 OK with an array of patient objects.
3. PUT /api/patients/:id
	Description: Update patient information and/or upload additional files.
	Request Body:
		age (Number) - Optional.
		sex (String) - Optional.
		condition (String) - Optional.
		processing_status(String) - Optional.
		Files: Multiple files can be uploaded.
	Response:
		200 OK with the updated patient object.

# File Storage
Uploaded files are stored in the directory specified by the FILES_DIR environment variable. By default, this is the files directory in the root of the project.

# Note:
1. Ensure 'files' directory is present.


## Patient Management Frontend

This project is a React-based Patient Management Dashboard that provides a UI for managing patient records, including the ability to view, add, and update patient details and files. The application uses Redux for state management, Axios for API calls, and features real-time updates to reflect database changes.

# Features
- **Dashboard View**: Displays a list of patients with their details and file statuses.
- **Add Patient**: Allows for adding new patient records, including uploading multiple files.
- **View and Download Files**: Provides options to view and download files associated with patients.
- **Dynamic Updates**: Automatically reflects changes in the database without needing a page refresh. GET requests are made every 10 seconds to keep data up-to-date.

# Technologies Used
- **React**: Frontend library for building the user interface.
- **Redux**: State management for handling application state and props management.
- **Axios**: HTTP client for making API requests.
- **Material-UI**: Component library for UI elements.
- **date-fns**: Date formatting library.

# Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Preet-Singhvi/BrainSight-AI.git
2. Navigate to the project directory:
   cd BrainSight-AI/ui
3. Install Dependencies:
   npm install

# Usage
1.Start the Development Server
	npm start
The application will be available at http://localhost:3000.

# Backend API
Ensure the backend server is running on http://localhost:8000. The API endpoints include:
	1. GET /patients: Fetches the list of patients.
	2. POST /patients: Adds a new patient.
	3. PUT /patients/:id: Updates patient information and uploads files.
	4. GET /files/:filename: Retrieves file content.
	5. GET /download/:filename: Provides file download


# Redux and Props Management
1. Redux: Used for managing global state such as patient data and dialog states. The state is updated based on user interactions and API responses.
2. Props Management: Handles component-specific state and actions passed as props, enabling components to communicate and manage their own local state.

# Real-Time Updates
The application uses a polling mechanism to ensure that patient data is updated automatically:
1. Polling Interval: A GET request is made every 10 seconds to fetch the latest patient data and reflect any database changes without needing a manual refresh.

# Components
1. Dashboard: Displays patient information in a table and allows adding new patients.
2. PatientDialog: A form dialog for adding new patient records.
3. FilesDialog: A dialog for viewing and uploading files associated with patients.

# Note
1. Multiple files can be uploaded at a time.



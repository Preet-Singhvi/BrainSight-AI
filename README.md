Patient Management Backend
This Node.js backend application handles patient data, including secure file uploads, patient information storage, and access to uploaded files. The application is built with Express.js, MongoDB, and follows best practices for security and scalability.

Features
1. Patient Data Management: Create, update, and retrieve patient information.
2. File Upload: Upload multiple files associated with a patient record.
3. Secure File Access: Serve stored files securely via a static endpoint.
4. Robust Security: Implemented security practices including CORS.
5. Modular Design: Separation of concerns with dedicated modules for routing, database connection, and configuration.

Installation
1. Prerequisites:
	Node.js
	MongoDB

Steps:
1. Clone the repository:
	git clone https://github.com/Preet-Singhvi/BrainSight-AI.git
	cd BrainSight-AI
2. Install Dependencies:
	npm install
3. Set up MongoDB:
	Ensure MongoDB is running locally or set up a remote MongoDB instance.
4. Create a .env file in the root directory and configure your environment variables (see below).
5. node index.js

Environment Variables
The application uses environment variables for configuration. Create a .env file in the root directory and add the following variables:
	PORT=8000
	MONGO_URI=mongodb://localhost:27017/patientDB
	FILES_DIR=files

Usage
Once the server is running, you can interact with the API through tools like Postman or cURL.

Example Requests
	Add a Patient: POST /api/patients
	Get All Patients: GET /api/patients
	Update Patient Info: PUT /api/patients/:id

API Endpoints
1. POST /api/patients
	Description: Create a new patient record with associated files.
	Request Body:
		patient_name (String) - Required.
		age_sex (String) - Required.
		condition (String) - Required.
		Files: Multiple files can be uploaded.
	Response:
		200 OK on success, with patient details in the response body.
2. GET /api/patients
	Description: Retrieve all patient records.
	Response:
		200 OK with an array of patient objects.
3. PUT /api/patients/:id
	Description: Update patient information and/or upload additional files.
	Request Body:
		age_sex (String) - Optional.
		condition (String) - Optional.
		Files: Multiple files can be uploaded.
	Response:
		200 OK with the updated patient object.

File Storage
Uploaded files are stored in the directory specified by the FILES_DIR environment variable. By default, this is the files directory in the root of the project.

Note:
1. Ensure 'files' directory is present.

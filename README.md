# Image Upload and Management System

## Overview

This project provides an image upload and management system, allowing users to upload images, view uploaded images, and manage them within a dashboard. It uses a Node.js backend with Express, Multer for file uploads, and JWT-based authentication to secure API endpoints. The frontend is built with React and utilizes SweetAlert2 for notifications.

## Features

- **User Registration and Authentication**: Users can register, log in, and receive a JWT token.
- **File Upload**: Users can upload images with size restrictions (5MB limit) and supported formats (jpeg, jpg, png, webp, ico, gif, svg).
- **Image Management**: Users can view a list of images they have uploaded.
- **Token Authentication**: JWT tokens are used for authentication, with token validation on protected routes.
- **Rate Limiting**: Each user is limited to 100 images.

## Tech Stack

- **Frontend**: React, SweetAlert2
- **Backend**: Node.js, Express, Multer
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Token)
- **File Storage**: Local file storage for uploaded images

## Setup

### Prerequisites

- Node.js (v14 or above)
- MongoDB (local or cloud)
- Postman (for testing APIs)
- React environment (for frontend)

### Installation

1. **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2. **Install backend dependencies**:

    ```bash
    cd api
    npm install
    ```

3. **Install frontend dependencies**:

    ```bash
    cd main
    npm install
    ```

4. **Set up environment variables**:

    In the `api` folder, create a `.env` file with the following contents:

    ```
    JWT_SECRET=your_jwt_secret_key
    MONGO_URI=your_mongodb_connection_string
    ```

    Replace `your_jwt_secret_key` with a secret key for JWT signing and `your_mongodb_connection_string` with your MongoDB connection URI.

5. **Run the backend**:

    ```bash
    cd api
    npm start
    ```

6. **Run the frontend**:

    ```bash
    cd client
    npm start
    ```

### Running the Application

- **Backend**: The server will run on `http://localhost:8080`.
- **Frontend**: The React application will run on `http://localhost:3000`.

### API Endpoints

#### **Authentication**

- `POST /api/auth/register`: Register a new user. Requires `email` and `password`.
- `POST /api/auth/login`: Log in a user and get a JWT token. Requires `email` and `password`.
- `POST /api/auth/logout`: Log out the user by invalidating the token.

#### **Image Upload**

- `POST /api/upload`: Upload an image. Requires authentication via JWT. Image file is uploaded as `image` in the request body.
- `GET /api/images`: Retrieve all images uploaded by the logged-in user.

#### **Image Management**

- `GET /api/images`: Get all images uploaded by the logged-in user.
- **Limit**: Each user can upload a maximum of 100 images.

### Frontend Features

- **File Upload**: Allows users to upload images.
- **Image List**: Displays all uploaded images with options to view them.
- **Error and Success Alerts**: SweetAlert2 is used for displaying notifications.
- **Authentication**: Users must be logged in to upload and view images.

### Folder Structure
├── api/ # Backend directory │
├── models/ # Mongoose models (User, Image, etc.) │ 
├── routes/ # API routes (auth, images, etc.) │ 
├── utils/ # Utility functions (authenticateToken) 
│ └── app.js # Express app setup │ └── client/ # Frontend directory 
├── public/ # Public assets 
├── App/ # React components and pages 
├── App.tsx # Main app component 
└── components/ # Reusable components 


## Contributing

Feel free to fork this repository and create a pull request. Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

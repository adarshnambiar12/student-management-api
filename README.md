# Student Management REST API

A REST API for managing students and courses, built with Node.js, Express, MongoDB, and JWT authentication.

[Demo Frontend Video](https://drive.google.com/file/d/1Jk5dEYrROfXH46Zwa378ukfn5omVtsOx/view?usp=sharing)

## Features

- **Authentication & Security**: Secure JWT authentication system with admin login and rate limiting
- **Student Management**: Complete CRUD operations with profile management and course enrollment
- **Course Management**: Full course lifecycle with search functionality and credit tracking
- **Advanced Querying**: Pagination and filtering support for efficient data retrieval
- **File Upload Support**: Student profile picture uploads with proper validation
- **Input Validation**: Comprehensive request validation ensuring data integrity

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or Atlas)

### Installation Steps

1. Clone the repository
   ```bash
   git clone https://github.com/adarshnambiar12/student-management-api.git
   cd backend
   ``` 

2. Install dependencies
   ```bash
    npm install
    ```

3. Set up MongoDB
   - If you are using MongoDB Atlas, create a cluster and get the connection string.
   - If you are using a local MongoDB instance, ensure it is running.
   - Update the connection string in the `.env` file (see below for details).

4. Start the server
    ```bash
    npm start
    ```

    For development with automatic restart:
    ```bash
    npm run dev
    ```

5. The API will be running on `http://localhost:5000`.

## Environment Variables Configuration
To configure the environment variables for the application, follow these steps:

1. Create a file named `.env` in the root directory of the project
2. Copy the variables below and replace the values with your actual configuration
```plaintext
PORT=5000
#The port on which the server will run
MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/studentManagement?retryWrites=true&w=majority
#Your Connection URL
JWT_SECRET = your_secret_key
```
3. Save the file
4. The application will automatically load these variables using the dotenv package

## API Routes
### Base URL
- `http://localhost:5000`

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and receive a JWT token
### Students
- `GET /api/students`: Get all students
- `GET /api/students/:id`: Get a student by ID
- `POST /api/students`: Create a new student
- `PUT /api/students/:id`: Update a student by ID
- `DELETE /api/students/:id`: Delete a student by ID
### Courses
- `GET /api/courses`: Get all courses
- `GET /api/courses/:id`: Get a course by ID
- `POST /api/courses`: Create a new course
- `PUT /api/courses/:id`: Update a course by ID
- `DELETE /api/courses/:id`: Delete a course by ID

## Authentication Usage Guide
This API uses JSON Web Tokens (JWT) for authentication. Follow these steps to authenticate:

1. **Register a new user**:
   - Send a `POST` request to `/api/auth/register` with the following JSON body:
     ```json
     {
       "username": "your_username",
       "password": "your_password"
     }
     ```

2. **Login**:
    - Send a `POST` request to `/api/auth/login` with the following JSON body:
      ```json
      {
         "username": "your_username",
         "password": "your_password"
      }
      ```
    - If successful, you will receive a JWT token in the response.

3. **Access Protected Routes**:
    - Include the JWT token in the `Authorization` header of your requests to protected routes:
      ```
      x-auth-token: your_jwt_token
      ```

4. Token Expiration
- The JWT token will be valid for 24 hours. After this period, you will need to log in again to obtain a new token.

### Testing
The included Postman collection automatically handles token management:

- Use the "Register Admin" or "Login Admin" request first
- The collection uses a test script to automatically extract the token from the response
- All subsequent requests will use this token

### Postman Collection
You can import the Postman collection from the `postman` directory to test the API endpoints.

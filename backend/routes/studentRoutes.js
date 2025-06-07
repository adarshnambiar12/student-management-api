import express from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadProfilePicture
} from '../controllers/studentController.js';
import auth from '../middleware/auth.js';
import upload from '../utils/fileUpload.js';
import { studentValidationRules, handleValidationErrors } from '../middleware/validators.js';

const router = express.Router();

// Protect all routes
router.use(auth);

// @route   GET /students
// @desc    Get all students
// @access  Private
router.get(
  '/', 
  studentValidationRules.paginate,
  handleValidationErrors,
  getAllStudents
);

// @route   GET /students/:id
// @desc    Get student by ID
// @access  Private
router.get(
  '/:id', 
  studentValidationRules.getById,
  handleValidationErrors,
  getStudentById
);

// @route   POST /students
// @desc    Create a student
// @access  Private
router.post(
  '/', 
  studentValidationRules.create,
  handleValidationErrors,
  createStudent
);

// @route   PUT /students/:id
// @desc    Update a student
// @access  Private
router.put(
  '/:id', 
  studentValidationRules.update,
  handleValidationErrors,
  updateStudent
);

// @route   DELETE /students/:id
// @desc    Delete a student
// @access  Private
router.delete(
  '/:id', 
  studentValidationRules.delete,
  handleValidationErrors,
  deleteStudent
);

// @route   POST /students/:id/profile-picture
// @desc    Upload profile picture for a student
router.post(
  '/:id/profile-picture',
  studentValidationRules.getById,
  handleValidationErrors,
  upload.single('profilePicture'),
  uploadProfilePicture
);

export default router;
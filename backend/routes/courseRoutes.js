import express from 'express';
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courseController.js';
import auth from '../middleware/auth.js';
import { courseValidationRules, handleValidationErrors } from '../middleware/validators.js';

const router = express.Router();

// Protect all routes
router.use(auth);

// @route   GET /courses
// @desc    Get all courses with optional title search
// @access  Private
router.get(
  '/', 
  courseValidationRules.search,
  handleValidationErrors,
  getAllCourses
);

// @route   POST /courses
// @desc    Create a course
// @access  Private
router.post(
  '/', 
  courseValidationRules.create,
  handleValidationErrors,
  createCourse
);

// @route   PUT /courses/:id
// @desc    Update a course
// @access  Private
router.put(
  '/:id', 
  courseValidationRules.update,
  handleValidationErrors,
  updateCourse
);

// @route   DELETE /courses/:id
// @desc    Delete a course
// @access  Private
router.delete(
  '/:id', 
  courseValidationRules.delete,
  handleValidationErrors,
  deleteCourse
);

export default router;
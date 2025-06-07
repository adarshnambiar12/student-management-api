import { body, param, query, validationResult } from 'express-validator';

// Helper function to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Student validation rules
export const studentValidationRules = {
  create: [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isString().withMessage('Name must be a string')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
      
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Must be a valid email address')
      .normalizeEmail(),
      
    body('age')
      .optional()
      .isInt({ min: 16, max: 100 }).withMessage('Age must be between 16 and 100'),
      
    body('department')
      .optional()
      .isString().withMessage('Department must be a string'),
      
    body('enrolledCourses')
      .optional()
      .isArray().withMessage('Enrolled courses must be an array')
      .custom(courses => {
        if (!courses.every(course => typeof course === 'string')) {
          throw new Error('Each course ID must be a string');
        }
        return true;
      })
  ],
  
  update: [
    param('id').isMongoId().withMessage('Invalid student ID format'),
    
    body('name')
      .optional()
      .isString().withMessage('Name must be a string')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
      
    body('email')
      .optional()
      .isEmail().withMessage('Must be a valid email address')
      .normalizeEmail(),
      
    body('age')
      .optional()
      .isInt({ min: 16, max: 100 }).withMessage('Age must be between 16 and 100'),
      
    body('department')
      .optional()
      .isString().withMessage('Department must be a string'),
      
    body('enrolledCourses')
      .optional()
      .isArray().withMessage('Enrolled courses must be an array')
      .custom(courses => {
        if (!courses.every(course => typeof course === 'string')) {
          throw new Error('Each course ID must be a string');
        }
        return true;
      })
  ],
  
  getById: [
    param('id').isMongoId().withMessage('Invalid student ID format')
  ],
  
  delete: [
    param('id').isMongoId().withMessage('Invalid student ID format')
  ],
  
  paginate: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
      
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
      
    query('department')
      .optional()
      .isString().withMessage('Department must be a string')
  ]
};

// Course validation rules
export const courseValidationRules = {
  create: [
    body('title')
      .notEmpty().withMessage('Title is required')
      .isString().withMessage('Title must be a string')
      .isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters'),
      
    body('description')
      .optional()
      .isString().withMessage('Description must be a string'),
      
    body('credits')
      .optional()
      .isInt({ min: 1, max: 20 }).withMessage('Credits must be between 1 and 20')
  ],
  
  update: [
    param('id').isMongoId().withMessage('Invalid course ID format'),
    
    body('title')
      .optional()
      .isString().withMessage('Title must be a string')
      .isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters'),
      
    body('description')
      .optional()
      .isString().withMessage('Description must be a string'),
      
    body('credits')
      .optional()
      .isInt({ min: 1, max: 20 }).withMessage('Credits must be between 1 and 20')
  ],
  
  getById: [
    param('id').isMongoId().withMessage('Invalid course ID format')
  ],
  
  delete: [
    param('id').isMongoId().withMessage('Invalid course ID format')
  ],
  
  search: [
    query('title')
      .optional()
      .isString().withMessage('Title must be a string')
  ]
};

// Auth validation rules
export const authValidationRules = {
  register: [
    body('username')
      .notEmpty().withMessage('Username is required')
      .isString().withMessage('Username must be a string')
      .isLength({ min: 4, max: 30 }).withMessage('Username must be between 4 and 30 characters'),
      
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  
  login: [
    body('username')
      .notEmpty().withMessage('Username is required'),
      
    body('password')
      .notEmpty().withMessage('Password is required')
  ]
};
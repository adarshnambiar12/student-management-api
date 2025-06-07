import Student from '../models/Student.js';
import fs from 'fs';
import path from 'path';

// Get all students with pagination and filters
export const getAllStudents = async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const department = req.query.department; // Optional department filter
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (department) {
      filter.department = department;
    }
    
    // Execute query with pagination and filters
    const students = await Student.find(filter)
      .populate('enrolledCourses')
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination info
    const total = await Student.countDocuments(filter);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.json({
      students,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('enrolledCourses');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a student
export const createStudent = async (req, res) => {
  const { name, email, age, department, enrolledCourses } = req.body;
  
  try {
    // Check if student already exists
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }
    
    // Create new student
    student = new Student({
      name,
      email,
      age,
      department,
      enrolledCourses
    });
    
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a student
export const updateStudent = async (req, res) => {
  const { name, email, age, department, enrolledCourses } = req.body;
  
  // Build student object
  const studentFields = {};
  if (name) studentFields.name = name;
  if (email) studentFields.email = email;
  if (age) studentFields.age = age;
  if (department) studentFields.department = department;
  if (enrolledCourses) studentFields.enrolledCourses = enrolledCourses;
  
  try {
    let student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Update
    student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: studentFields },
      { new: true }
    ).populate('enrolledCourses');
    
    res.json(student);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    await Student.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Student removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Delete old profile picture if exists
    if (student.profilePicture) {
      const oldPicturePath = path.join(process.cwd(), student.profilePicture);
      if (fs.existsSync(oldPicturePath)) {
        fs.unlinkSync(oldPicturePath);
      }
    }
    
    // Update student with new profile picture path
    const profilePicturePath = `/uploads/profilePictures/${req.file.filename}`;
    student.profilePicture = profilePicturePath;
    
    await student.save();
    
    res.json({
      message: 'Profile picture uploaded successfully',
      student
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
import Course from '../models/Course.js';

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    // Check for title search query
    if (req.query.title) {
      const courses = await Course.find({ 
        title: { $regex: req.query.title, $options: 'i' } 
      });
      return res.json(courses);
    }
    
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a course
export const createCourse = async (req, res) => {
  const { title, description, credits } = req.body;
  
  try {
    // Create new course
    const course = new Course({
      title,
      description,
      credits
    });
    
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  const { title, description, credits } = req.body;
  
  // Build course object
  const courseFields = {};
  if (title) courseFields.title = title;
  if (description) courseFields.description = description;
  if (credits !== undefined) courseFields.credits = credits;
  
  try {
    let course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Update
    course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: courseFields },
      { new: true }
    );
    
    res.json(course);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await Course.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Course removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};
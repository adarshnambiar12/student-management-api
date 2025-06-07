import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  age: Number,
  department: String,
  admissionDate: { 
    type: Date, 
    default: Date.now 
  },
  enrolledCourses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  }],
  profilePicture: {
    type: String,
    default: null
  },
});

export default mongoose.model('Student', studentSchema);
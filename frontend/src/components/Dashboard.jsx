import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { 
  getStudents, 
  createStudent, 
  deleteStudent, 
  getCourses, 
  createCourse, 
  deleteCourse, 
  updateStudent 
} from '../utils/api';

const Dashboard = () => {
  // State
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    age: '',
    department: '',
    enrolledCourses: []
  });
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    credits: ''
  });
  
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsData, coursesData] = await Promise.all([
          getStudents(),
          getCourses()
        ]);
        setStudents(studentsData.students || studentsData);
        setCourses(coursesData.courses || coursesData);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handlers for students
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const student = await createStudent(newStudent);
      setStudents([...students, student]);
      setNewStudent({
        name: '',
        email: '',
        age: '',
        department: '',
        enrolledCourses: []
      });
    } catch (err) {
      setError('Failed to add student. Please try again.');
      console.error('Error adding student:', err);
    }
  };
  
  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent(id);
      setStudents(students.filter(student => student._id !== id));
    } catch (err) {
      setError('Failed to delete student. Please try again.');
      console.error('Error deleting student:', err);
    }
  };
  
  // Handlers for courses
  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const course = await createCourse(newCourse);
      setCourses([...courses, course]);
      setNewCourse({
        title: '',
        description: '',
        credits: ''
      });
    } catch (err) {
      setError('Failed to add course. Please try again.');
      console.error('Error adding course:', err);
    }
  };
  
  const handleDeleteCourse = async (id) => {
    try {
      await deleteCourse(id);
      setCourses(courses.filter(course => course._id !== id));
    } catch (err) {
      setError('Failed to delete course. Please try again.');
      console.error('Error deleting course:', err);
    }
  };
  
  // Enroll student in courses
  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent || selectedCourses.length === 0) {
      setError('Please select a student and at least one course');
      return;
    }
    
    try {
      const student = students.find(s => s._id === selectedStudent);
      const updatedEnrolledCourses = [
        ...new Set([...student.enrolledCourses, ...selectedCourses])
      ];
      
      const updatedStudent = await updateStudent(selectedStudent, {
        ...student,
        enrolledCourses: updatedEnrolledCourses
      });
      
      setStudents(
        students.map(s => 
          s._id === selectedStudent ? updatedStudent : s
        )
      );
      
      setSelectedStudent('');
      setSelectedCourses([]);
      setIsEnrolling(false);
    } catch (err) {
      setError('Failed to enroll student. Please try again.');
      console.error('Error enrolling student:', err);
    }
  };
  
  // Form change handlers
  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value
    });
  };
  
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({
      ...newCourse,
      [name]: name === 'credits' ? parseInt(value) || '' : value
    });
  };
  
  // Toggle enrollment form
  const toggleEnrollForm = () => {
    setIsEnrolling(!isEnrolling);
    setSelectedStudent('');
    setSelectedCourses([]);
  };
  
  // Handle course selection for enrollment
  const handleCourseSelection = (e) => {
    const courseId = e.target.value;
    setSelectedCourses(
      e.target.checked
        ? [...selectedCourses, courseId]
        : selectedCourses.filter(id => id !== courseId)
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError('')}
            >
              <span className="sr-only">Dismiss</span>
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}
        
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                className={`${
                  activeTab === 'students'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base sm:px-4`}
                onClick={() => setActiveTab('students')}
              >
                Students
              </button>
              <button
                className={`${
                  activeTab === 'courses'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base sm:px-4 ml-8`}
                onClick={() => setActiveTab('courses')}
              >
                Courses
              </button>
              <button
                className={`${
                  activeTab === 'enrollment'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base sm:px-4 ml-8`}
                onClick={() => setActiveTab('enrollment')}
              >
                Enrollment
              </button>
            </nav>
          </div>
        </div>
        
        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            <div className="mb-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newStudent.name}
                      onChange={handleStudentChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newStudent.email}
                      onChange={handleStudentChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newStudent.age}
                      onChange={handleStudentChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newStudent.department}
                      onChange={handleStudentChange}
                    />
                  </div>
                </div>
                <div>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add Student
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Student List</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrolled Courses
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No students found
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.department || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.age || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.enrolledCourses && student.enrolledCourses.length > 0 
                              ? student.enrolledCourses.length
                              : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteStudent(student._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="mb-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newCourse.title}
                      onChange={handleCourseChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                    <input
                      type="number"
                      id="credits"
                      name="credits"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newCourse.credits}
                      onChange={handleCourseChange}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newCourse.description}
                      onChange={handleCourseChange}
                    ></textarea>
                  </div>
                </div>
                <div>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add Course
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Course List</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credits
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No courses found
                        </td>
                      </tr>
                    ) : (
                      courses.map((course) => (
                        <tr key={course._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {course.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {course.description ? (
                              <div className="max-w-xs truncate">{course.description}</div>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.credits || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Enrollment Tab */}
        {activeTab === 'enrollment' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Enroll Student in Courses</h2>
            
            <form onSubmit={handleEnrollStudent} className="space-y-6">
              <div>
                <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                <select
                  id="student"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                >
                  <option value="">-- Select a student --</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedStudent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Courses</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
                    {courses.length === 0 ? (
                      <p className="text-gray-500">No courses available</p>
                    ) : (
                      courses.map((course) => {
                        const student = students.find(s => s._id === selectedStudent);
                        const isEnrolled = student?.enrolledCourses?.includes(course._id);
                        
                        return (
                          <div key={course._id} className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id={`course-${course._id}`}
                                type="checkbox"
                                value={course._id}
                                checked={selectedCourses.includes(course._id)}
                                onChange={handleCourseSelection}
                                disabled={isEnrolled}
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor={`course-${course._id}`}
                                className={`font-medium ${isEnrolled ? 'text-gray-400' : 'text-gray-700'}`}
                              >
                                {course.title}
                                {isEnrolled && ' (Already enrolled)'}
                              </label>
                              {course.description && (
                                <p className="text-gray-500 text-xs mt-1">
                                  {course.description.substring(0, 100)}
                                  {course.description.length > 100 ? '...' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={!selectedStudent || selectedCourses.length === 0}
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
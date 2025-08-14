import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, BookOpen, Users, Search, Tag } from 'lucide-react';
import { Course, Module } from '../../types/modules';
import { getAllCourses, getCourseById, getCourseWithModulesById } from '../../services/api/modules';
import { CourseEditor, ModuleManager, CategoryManager } from '../../components/admin';

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourseModules, setSelectedCourseModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'overview' | 'course-edit' | 'module-manage' | 'category-manage'>('overview');

  // Load all courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getAllCourses();
        setCourses(response.data || []);
      } catch (err) {
        setError('Failed to load courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCourse = async (course: Course) => {
    try {
      setLoading(true);
      
      try {
        const response = await getCourseById(course.id);
        console.log('Course edit response:', response);
        
        // Handle different possible response structures
        const courseData = response.data?.course || response.data || response;
        const modulesData = response.data?.modules || [];
        
        console.log('Parsed course data:', courseData);
        console.log('Parsed modules data:', modulesData);
        
        // Use the fetched data if available, otherwise fall back to the original course
        setSelectedCourse(courseData && courseData.id ? courseData : course);
        setSelectedCourseModules(modulesData);
      } catch (apiError) {
        console.warn('API call failed, using original course data:', apiError);
        // Fallback to the original course data if API fails
        setSelectedCourse(course);
        setSelectedCourseModules([]);
      }
      
      setView('course-edit');
    } catch (err) {
      setError('Failed to load course details');
      console.error('Error fetching course details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManageModules = async (course: Course) => {
    try {
      setLoading(true);
      
      try {
        const response = await getCourseWithModulesById(course.id);
        console.log('Module management response:', response);
        
        // Handle different possible response structures
        const courseData = response.data || response;
        const modulesData = response.data?.modules || [];
        
        console.log('Parsed course data:', courseData);
        console.log('Parsed modules data:', modulesData);
        
        // Use the fetched data if available, otherwise fall back to the original course
        setSelectedCourse(courseData && courseData.id ? courseData : course);
        setSelectedCourseModules(modulesData);
      } catch (apiError) {
        console.warn('API call failed, using original course data:', apiError);
        // Fallback to the original course data if API fails
        setSelectedCourse(course);
        setSelectedCourseModules([]);
      }
      
      setView('module-manage');
    } catch (err) {
      setError('Failed to load course modules');
      console.error('Error fetching course modules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToOverview = () => {
    setView('overview');
    setSelectedCourse(null);
    setSelectedCourseModules([]);
  };

  const handleManageCategories = () => {
    setView('category-manage');
  };

  const refreshCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.data || []);
    } catch (err) {
      console.error('Error refreshing courses:', err);
    }
  };

  if (loading && view === 'overview') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && view === 'overview') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage courses, modules, and content</p>
            </div>
            <div className="flex items-center gap-4">
              {view !== 'overview' && (
                <button
                  onClick={handleBackToOverview}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back to Overview
                </button>
              )}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Course
              </button>
              <button 
                onClick={handleManageCategories}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                Manage Categories
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview */}
        {view === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Courses</p>
                    <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Students</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Courses</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{course.name}</div>
                          <div className="text-sm text-gray-500">ID: {course.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {course.description || 'No description'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleManageModules(course)}
                              className="text-green-600 hover:text-green-900 flex items-center gap-1"
                            >
                              <BookOpen className="w-4 h-4" />
                              Modules
                            </button>
                            <button className="text-red-600 hover:text-red-900 flex items-center gap-1">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Course Editor */}
        {view === 'course-edit' && (
          selectedCourse ? (
            <CourseEditor
              course={selectedCourse}
              onSave={refreshCourses}
              onCancel={handleBackToOverview}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading course details...</p>
              </div>
            </div>
          )
        )}

        {/* Module Manager */}
        {view === 'module-manage' && (
          selectedCourse ? (
            <ModuleManager
              course={selectedCourse}
              modules={selectedCourseModules}
              onSave={refreshCourses}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading course modules...</p>
              </div>
            </div>
          )
        )}

        {/* Category Manager */}
        {view === 'category-manage' && (
          <CategoryManager onBack={handleBackToOverview} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

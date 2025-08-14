import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, AlertCircle } from 'lucide-react';
import { Course } from '../../types/modules';
import { updateCourse } from '../../services/api/modules';

interface CourseEditorProps {
  course: Course;
  onSave: () => void;
  onCancel: () => void;
}

const CourseEditor: React.FC<CourseEditorProps> = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: course.name || '',
    description: course.description || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Update course via API
      await updateCourse(course.id, formData);
      
      setSuccess(true);
      setTimeout(() => {
        onSave();
      }, 1000);
    } catch (err) {
      setError('Failed to update course. Please try again.');
      console.error('Error updating course:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow"
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Edit Course</h3>
            <p className="text-sm text-gray-500">Course ID: {course.id}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-green-700">Course updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {/* Course Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Course Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter course name"
            />
          </div>

          {/* Course Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Course Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter course description"
            />
          </div>

          {/* Course Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created Date
              </label>
              <input
                type="text"
                value={new Date(course.createdAt).toLocaleDateString()}
                disabled
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Updated
              </label>
              <input
                type="text"
                value={new Date(course.updatedAt).toLocaleDateString()}
                disabled
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CourseEditor;

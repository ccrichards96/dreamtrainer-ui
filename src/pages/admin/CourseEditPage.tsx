import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseEditor } from "../../components/admin";
import { Course } from "../../types/modules";
import { getCourseById } from "../../services/api/modules";

interface CourseEditPageProps {
  onSave: () => void;
}

const CourseEditPage: React.FC<CourseEditPageProps> = ({ onSave }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    setLoading(true);
    setError(null);
    getCourseById(courseId)
      .then((response) => setCourse(response.data))
      .catch((err) => {
        console.error("Error fetching course details:", err);
        setError("Failed to load course details");
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleBackToOverview = () => navigate("/admin");

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-red-600 mb-4">{error || "Course not found"}</p>
        <button
          onClick={handleBackToOverview}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return <CourseEditor course={course} onSave={onSave} onCancel={handleBackToOverview} />;
};

export default CourseEditPage;

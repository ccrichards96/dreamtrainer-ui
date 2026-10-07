import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, BookOpen, ChevronDown, ChevronUp, X } from "lucide-react";
import { Category, CategoryCourse } from "../../types/categories";
import {
  getCategoryById,
  getCoursesByCategoryAdmin,
  reorderCategoryCourses,
} from "../../services/api/categories";

const CategoryEditPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [courses, setCourses] = useState<CategoryCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);
    Promise.all([getCategoryById(categoryId), getCoursesByCategoryAdmin(categoryId)])
      .then(([categoryData, coursesData]) => {
        setCategory(categoryData);
        setCourses(coursesData);
      })
      .catch((err) => {
        console.error("Error loading category courses:", err);
        setError("Failed to load category courses");
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  const handleMove = async (courseId: string, direction: "up" | "down") => {
    if (!categoryId) return;
    const currentIndex = courses.findIndex((c) => c.courseId === courseId);
    if (currentIndex === -1) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === courses.length - 1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newList = [...courses];
    [newList[currentIndex], newList[newIndex]] = [newList[newIndex], newList[currentIndex]];

    // Swap the two entries' order values (not sequential reindex) to avoid
    // colliding with any other entry's order under the unique-per-category constraint.
    const currentOrder = newList[currentIndex].order;
    const swappedOrder = newList[newIndex].order;
    newList[currentIndex] = { ...newList[currentIndex], order: swappedOrder };
    newList[newIndex] = { ...newList[newIndex], order: currentOrder };

    setCourses(newList);
    setReorderingId(courseId);

    try {
      await reorderCategoryCourses(categoryId, [
        { courseId: newList[currentIndex].courseId, order: newList[currentIndex].order },
        { courseId: newList[newIndex].courseId, order: newList[newIndex].order },
      ]);
    } catch (err) {
      console.error("Error reordering category courses:", err);
      setError("Failed to reorder courses. Please refresh the page.");
      const coursesData = await getCoursesByCategoryAdmin(categoryId);
      setCourses(coursesData);
    } finally {
      setReorderingId(null);
    }
  };

  const handleBackToCategories = () => navigate("/admin/categories");

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category courses...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-red-600 mb-4">{error || "Category not found"}</p>
        <button
          onClick={handleBackToCategories}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
          <p className="text-sm text-gray-500">
            Reorder the courses shown under this category using the up/down controls.
          </p>
        </div>
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">{courses.length} course(s) assigned</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {courses.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No courses are assigned to this category yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {courses.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <button
                      onClick={() => handleMove(entry.courseId, "up")}
                      disabled={index === 0 || reorderingId !== null}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(entry.courseId, "down")}
                      disabled={index === courses.length - 1 || reorderingId !== null}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {entry.course.name}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Order: {entry.order} | Status: {entry.course.status} | Listing:{" "}
                      {entry.course.listingStatus}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryEditPage;

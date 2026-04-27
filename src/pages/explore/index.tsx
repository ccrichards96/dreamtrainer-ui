import { useState, useEffect, useMemo } from "react";
import { Loader2, Search } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllPublicCourses, getMyCourses } from "../../services/api/modules";
import { getAllCategories } from "../../services/api/categories";
import { CourseProvider } from "../../contexts/CourseContext";
import type { Course } from "../../types/modules";
import type { Category } from "../../types/categories";
import { AllCoursesView } from "./AllCoursesView";

type TabType = "my-courses" | "explore";

const HERO_BG_IMAGE = "";

const ExploreCoursesContent = () => {
  const { isAuthenticated } = useAuth0();
  const [exploreCourses, setExploreCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Always fetch public courses and categories
        const [publicCoursesResponse, categoriesData] = await Promise.all([
          getAllPublicCourses(),
          getAllCategories(),
        ]);

        // Only fetch user's courses if authenticated
        let myCoursesData: Course[] = [];
        if (isAuthenticated) {
          try {
            const myCoursesResponse = await getMyCourses();
            myCoursesData = myCoursesResponse.data || [];
          } catch (err) {
            console.warn("Failed to fetch user courses (may not be authenticated):", err);
          }
        }

        const sortedPublic = (publicCoursesResponse.data || []).sort((a: Course, b: Course) => {
          if (a.order !== b.order) return a.order - b.order;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
        const myCourseIds = new Set(myCoursesData.map((c) => c.id));
        setExploreCourses(sortedPublic.filter((c) => !myCourseIds.has(c.id)));
        setMyCourses(myCoursesData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err instanceof Error ? err.message : "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const filteredCourses = useMemo(() => {
    let filtered = activeTab === "my-courses" ? myCourses : exploreCourses;

    if (selectedCategoryId) {
      filtered = filtered.filter((course) => course.categoryId === selectedCategoryId);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [exploreCourses, myCourses, activeTab, selectedCategoryId, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#c5a8de]" />
          <span className="text-gray-600">Loading courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden bg-[#1e1630]"
        style={
          HERO_BG_IMAGE
            ? {
                backgroundImage: `url(${HERO_BG_IMAGE})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {/* Dark overlay (only when background image is set) */}
        {HERO_BG_IMAGE && <div className="absolute inset-0 bg-black/55" />}

        {/* Preline-style gradient blobs */}
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 -translate-x-1/2 pointer-events-none"
        >
          <div className="bg-gradient-to-r from-violet-500/40 to-purple-300/30 blur-3xl w-[400px] h-[700px] rotate-[-60deg] -translate-x-40" />
          <div className="bg-gradient-to-tl from-indigo-900/60 via-purple-900/40 to-violet-800/30 blur-3xl w-[1440px] h-[800px] rounded-full origin-top-left -rotate-12 -translate-x-60" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="inline-block text-sm font-medium bg-clip-text bg-gradient-to-l from-blue-400 to-violet-400 text-transparent">
              Dream Trainer
            </p>
            <h1 className="mt-3 block font-semibold text-white text-4xl md:text-5xl lg:text-6xl">
              Explore Courses
            </h1>
            <p className="mt-4 text-lg text-white/70">
              Find the perfect course to elevate your career.
            </p>
            {/* Search bar */}
            <div className="mt-8 relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-transparent rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>

            {/* Category pills */}
            {categories.length > 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategoryId === null
                      ? "bg-white text-purple-700 shadow-md"
                      : "bg-white/15 text-white border border-white/25 hover:bg-white/25"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() =>
                      setSelectedCategoryId(selectedCategoryId === category.id ? null : category.id)
                    }
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategoryId === category.id
                        ? "bg-white text-purple-700 shadow-md"
                        : "bg-white/15 text-white border border-white/25 hover:bg-white/25"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs + Course Grid ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {/* Tabs — only show when authenticated */}
        {isAuthenticated && (
          <div className="mb-6">
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => setActiveTab("explore")}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "explore"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Explore New Courses
              </button>
              <button
                onClick={() => setActiveTab("my-courses")}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "my-courses"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                My Courses
              </button>
            </div>
          </div>
        )}

        <AllCoursesView courses={filteredCourses} />
      </div>
    </div>
  );
};

export default function ExploreCourses() {
  return (
    <CourseProvider>
      <ExploreCoursesContent />
    </CourseProvider>
  );
}


import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMyCourses } from "../../services/api/modules";
import { getAllCategories } from "../../services/api/categories";
import { CourseProvider } from "../../contexts/CourseContext";
import type { Course } from "../../types/modules";
import type { Category } from "../../types/categories";
import { AllCoursesView } from "./AllCoursesView";
import PageHero from "../../components/PageHero";

const HERO_BG_IMAGE = "";

const ExploreCoursesContent = () => {
  const { isAuthenticated } = useAuth0();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Selected category lives in the URL (?category=<slug>) so it can be linked to directly
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategorySlug = searchParams.get("category");
  const selectedCategoryId = categories.find((c) => c.slug === selectedCategorySlug)?.id ?? null;

  const setSelectedCategory = (slug: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (slug) next.set("category", slug);
        else next.delete("category");
        return next;
      },
      { replace: true }
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriesData = await getAllCategories();

        // Only fetch user's courses if authenticated — they're excluded from the list (see My Courses)
        let myCoursesData: Course[] = [];
        if (isAuthenticated) {
          try {
            const myCoursesResponse = await getMyCourses();
            myCoursesData = myCoursesResponse.data || [];
          } catch (err) {
            console.warn("Failed to fetch user courses (may not be authenticated):", err);
          }
        }

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

  const sortByOrder = (a: Course, b: Course) => {
    if (a.order !== b.order) return a.order - b.order;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  };

  // Within a category, respect the admin-defined categoryOrder; fall back to global order
  const sortByCategoryOrder = (a: Course, b: Course) => {
    const aOrder = a.categoryOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.categoryOrder ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return sortByOrder(a, b);
  };

  // Union every category's courses, deduped by id, for the unfiltered "All" view
  const allCourses = useMemo(() => {
    const byId = new Map<string, Course>();
    categories.forEach((category) => {
      category.courses?.forEach((course) => byId.set(course.id, course));
    });
    return Array.from(byId.values()).sort(sortByOrder);
  }, [categories]);

  const exploreCourses = useMemo(() => {
    const myCourseIds = new Set(myCourses.map((c) => c.id));
    const base = selectedCategoryId
      ? [...(categories.find((c) => c.id === selectedCategoryId)?.courses ?? [])].sort(
          sortByCategoryOrder
        )
      : allCourses;
    return base.filter((c) => !myCourseIds.has(c.id));
  }, [allCourses, categories, selectedCategoryId, myCourses]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return exploreCourses;

    const query = searchQuery.toLowerCase();
    return exploreCourses.filter(
      (course) =>
        course.name.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query)
    );
  }, [exploreCourses, searchQuery]);

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
      <PageHero
        title="Explore Courses"
        subtitle="Find the perfect course to elevate your career."
        backgroundImage={HERO_BG_IMAGE}
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: "Search courses...",
        }}
      >
        {/* Category pills */}
        {categories.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
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
                  setSelectedCategory(selectedCategoryId === category.id ? null : category.slug)
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
      </PageHero>

      {/* ── Course Grid ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
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

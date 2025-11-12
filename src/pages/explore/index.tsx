import { useState } from "react";
import { BookOpen, ArrowRight } from "lucide-react";

const ExploreCourses = () => {
  const [activeTab, setActiveTab] = useState<"explore" | "active" | "completed">("explore");
  const [courseCategory] = useState("TOEFL Mastery");
  const [categoryTag] = useState("Prepare");
  const [categoryType] = useState("Test Prep");
  const [categoryDescription] = useState(
    "Writing, Reading, Listening, & Speaking - All designed to help you pass the TOEFL exam & get your dream job!"
  );
  const [allCourses] = useState([
    {
      id: "writing",
      title: "Writing",
      description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
      status: "continue" as const,
      image: "bg-gradient-to-br from-blue-400 to-cyan-300",
      isActive: true,
      progress: 45,
    },
    {
      id: "reading",
      title: "Reading",
      description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
      status: "start" as const,
      image: "bg-gradient-to-br from-blue-400 to-cyan-300",
      isActive: false,
      progress: 0,
    },
    {
      id: "listening",
      title: "Listening",
      description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
      status: "start" as const,
      image: "bg-gradient-to-br from-blue-400 to-cyan-300",
      isActive: false,
      progress: 0,
    },
    {
      id: "speaking",
      title: "Speaking",
      description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
      status: "start" as const,
      image: "bg-gradient-to-br from-blue-400 to-cyan-300",
      isActive: false,
      progress: 0,
    },
  ]);

  // Filter courses based on active tab
  const getDisplayedCourses = () => {
    switch (activeTab) {
      case "active":
        return allCourses.filter(course => course.isActive);
      case "completed":
        return []; // Placeholder - no completed courses yet
      case "explore":
      default:
        return allCourses;
    }
  };

  const courses = getDisplayedCourses();
  const activeCoursesCount = allCourses.filter(course => course.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb - Hidden for now */}
        {/* <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                <BookOpen className="w-4 h-4 mr-2" />
                All Courses
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{courseCategory}</span>
              </div>
            </li>
          </ol>
        </nav> */}

        {/* Header Section with Tabs */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                  {categoryTag}
                </span>
                <span className="text-sm text-gray-500">{categoryType}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{courseCategory}</h1>
              <p className="text-gray-600 mt-2">
                {categoryDescription}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("explore")}
                className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "explore"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Explore
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "active"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Active Courses
                <span className="inline-flex items-center justify-center w-5 h-5 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                  {activeCoursesCount}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "completed"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Completed Courses
              </button>
            </nav>
          </div>
        </div>

        {/* Course Cards Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Card Image */}
                <div className={`h-48 ${course.image} flex items-center justify-center`}>
                  <div className="text-white text-6xl font-light opacity-20">
                    {/* Placeholder for course icon */}
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 md:p-5">
                  <h3 className="text-lg font-bold text-gray-800">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    {course.description}
                  </p>
                  
                  {/* Progress Bar - Only show for active courses */}
                  {activeTab === "active" && course.progress > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">Progress</span>
                        <span className="text-xs font-medium text-gray-700">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-5">
                    {course.status === "continue" ? (
                      <button className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                        Continue Course
                      </button>
                    ) : (
                      <button className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                        Start Course
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {activeTab === "completed" ? "No Completed Courses" : "No Courses Found"}
            </h3>
            <p className="text-gray-500">
              {activeTab === "completed" 
                ? "Complete courses to see them here" 
                : "Start exploring courses to begin your learning journey"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreCourses;

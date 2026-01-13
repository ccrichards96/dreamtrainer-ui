import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import { MessageSquare, RefreshCw, AlertCircle, Calendar, Play, Mail } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDashboardContext, DashboardProvider } from "../../contexts";
import { CourseProvider } from "../../contexts/CourseContext";
import { useCourseContext } from "../../contexts/useCourseContext";
import DreamFlow from "../../components/DreamFlow";
import Modal from "../../components/modals/Modal";
import SupportMessageForm from "../../components/forms/SupportMessageForm";
import { Section } from "../../types/modules";
import { getCourseSections } from "../../services/api/modules";
import { sanitizeHtml } from "../../utils/htmlSanitizer";
import posthog from "posthog-js";

function DashboardContent() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, isAuthenticated } = useAuth0();
  const firstName = user?.given_name || "there";

  // Welcome modal state
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [supportMessageModalOpen, setSupportMessageModalOpen] = useState(false);

  // Check for first login and set welcome modal
  useEffect(() => {
    const checkFirstLogin = () => {
      if (isAuthenticated) {
        const storageKey = "hasVisitedDashboard";
        const hasVisitedBefore = localStorage.getItem(storageKey);
        if (!hasVisitedBefore || hasVisitedBefore !== "true") {
          // This is the first login
          setWelcomeModalOpen(true);
          posthog.capture("First Login", { user });
          // Mark as visited
          localStorage.setItem(storageKey, "true");
        }
      }
    };

    checkFirstLogin();
  }, [isAuthenticated, user]);

  // Use Dashboard context instead of dummy data
  const {
    startingScore,
    startingScoreDate,
    currentScore,
    currentScoreDate,
    announcements,
    loading: dashboardLoading,
    error: dashboardError,
    getTestScores,
  } = useDashboardContext();

  // Use Course context for module management
  const {
    modules,
    currentCourse,
    currentSectionId,
    tests,
    loading: courseLoading,
    error: courseError,
    loadCourse,
    loadSectionModules,
    startTestMode,
  } = useCourseContext();

  // State for available sections within the current course
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [switchingSection, setSwitchingSection] = useState<string | null>(null);
  
  // Ref to track if initialization has been done to prevent duplicate calls
  const isInitialized = useRef(false);
  const lastCourseId = useRef<string | null>(null);

  // Load course and sections on component mount or when courseId changes
  useEffect(() => {
    const initializeDashboard = async () => {
      // Use courseId from URL params, fallback to localStorage for backward compatibility
      const targetCourseId = courseId || localStorage.getItem("selected_course_id");
      
      // Skip if no course ID or if we've already initialized with this course
      if (!targetCourseId || (isInitialized.current && lastCourseId.current === targetCourseId)) {
        return;
      }

      try {
        isInitialized.current = true;
        lastCourseId.current = targetCourseId;
        
        const selectedSectionId = localStorage.getItem("selected_section_id");

        // Load the course from URL or localStorage
        await loadCourse(targetCourseId);
        await getTestScores(targetCourseId);

        // Fetch sections for this course
        const sections = await getCourseSections(targetCourseId);
        const sortedSections = sections.sort((a, b) => a.order - b.order);
        setAvailableSections(sortedSections);

        // Load modules for the active section
        if (selectedSectionId && sortedSections.some(s => s.id === selectedSectionId)) {
          await loadSectionModules(selectedSectionId);
        } else if (sortedSections.length > 0) {
          await loadSectionModules(sortedSections[0].id);
        }

        // Clear localStorage selection after loading
        localStorage.removeItem("selected_course_id");
        localStorage.removeItem("selected_section_id");
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        isInitialized.current = false; // Allow retry on error
      }
    };
    
    initializeDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]); // Only depend on courseId - functions are stable via useCallback in context

  // Handle section switching
  const handleSwitchSection = async (sectionId: string) => {
    try {
      setSwitchingSection(sectionId);
      // Load modules for the selected section from context
      await loadSectionModules(sectionId);
    } catch (error) {
      console.error("Error switching section:", error);
    } finally {
      setSwitchingSection(null);
    }
  };

  const handleCourseComplete = () => {
    console.log("Course completed!");
    // Course completion handling - no longer navigating to assessment
  };

  // Combined loading state
  const loading = dashboardLoading || courseLoading;
  const error = dashboardError || courseError;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#c5a8de]" />
              <span className="text-lg text-gray-600">Loading your dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load dashboard</h2>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {firstName}!</h1>
          <p className="text-xl text-gray-600">Let's get you to your dream TOEFL score.</p>
        </motion.div>

        {/* Available Sections - Only show if course is loaded and has sections */}
        {currentCourse && availableSections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{currentCourse.name}</h2>
            <p className="text-gray-600 mb-4">Select a section to continue learning</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableSections.map((section, index) => {
                const isActive = currentSectionId === section.id;
                const isLoading = switchingSection === section.id;

                return (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => !isActive && handleSwitchSection(section.id)}
                    disabled={isLoading}
                    className={`relative p-6 rounded-xl transition-all ${
                      isActive
                        ? "bg-gradient-to-br from-[#c5a8de] to-[#b399d6] text-white shadow-lg ring-2 ring-[#c5a8de] ring-offset-2"
                        : "bg-white text-gray-900 shadow-md hover:shadow-lg hover:scale-105"
                    } ${isLoading ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                  >
                    {isActive && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-white text-[#c5a8de] text-xs font-semibold px-2 py-1 rounded-full">
                          Active
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col items-center text-center">
                      {isLoading ? (
                        <RefreshCw className="w-8 h-8 mb-3 animate-spin" />
                      ) : (
                        <div
                          className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center ${
                            isActive ? "bg-white/20" : "bg-[#c5a8de]/10"
                          }`}
                        >
                          <svg
                            className={`w-6 h-6 ${isActive ? "text-white" : "text-[#c5a8de]"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                        </div>
                      )}

                      <h3
                        className={`font-semibold mb-1 ${isActive ? "text-white" : "text-gray-900"}`}
                      >
                        {section.name}
                      </h3>

                      {section.description && (
                        <p
                          className={`text-sm line-clamp-2 ${isActive ? "text-white/90" : "text-gray-600"}`}
                        >
                          {section.description}
                        </p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Score Progress Section - Only show if course has tests */}
        {tests.length > 0 && (startingScore !== null || currentScore !== null) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Starting Score */}
            {startingScore !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Starting Score</h2>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#c5a8de] mb-4">{startingScore}</div>
                  <div className="text-gray-600 text-lg">Initial Assessment</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Your baseline score when you started
                  </div>
                  {startingScoreDate && (
                    <div className="text-xs text-gray-400 mt-3">
                      Assessed:{" "}
                      {new Date(startingScoreDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Current Score */}
            {currentScore !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Current Score</h2>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-4">{currentScore}</div>
                  <div className="text-gray-600 text-lg">Latest Assessment</div>
                  {startingScore !== null && (
                    <div className="mt-4">
                      <div
                        className={`text-lg font-medium ${
                          currentScore > startingScore
                            ? "text-green-600"
                            : currentScore < startingScore
                              ? "text-red-500"
                              : "text-gray-600"
                        }`}
                      >
                        {currentScore > startingScore ? "+" : ""}
                        {currentScore - startingScore} points
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {currentScore > startingScore
                          ? "Great progress!"
                          : currentScore < startingScore
                            ? "Keep practicing!"
                            : "Steady performance"}
                      </div>
                    </div>
                  )}
                  {currentScoreDate && (
                    <div className="text-xs text-gray-400 mt-3">
                      Assessed:{" "}
                      {new Date(currentScoreDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* General Announcements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">General Announcements</h2>
            <button
              onClick={() => setWelcomeModalOpen(true)}
              className="text-base font-medium bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md flex items-center"
            >
              <Play className="w-5 h-5 mr-2" /> Watch Your Welcome Video!
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {announcements.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No announcements at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements
                  .sort((a, b) => {
                    // High priority announcements come first
                    if (a.priority === "high" && b.priority !== "high") return -1;
                    if (b.priority === "high" && a.priority !== "high") return 1;
                    // Low priority announcements come last
                    if (a.priority === "low" && b.priority !== "low") return 1;
                    if (b.priority === "low" && a.priority !== "low") return -1;
                    // Within the same priority, sort by most recent first
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  })
                  .map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        announcement.type === "general"
                          ? "border-blue-500 bg-blue-50"
                          : announcement.type === "account"
                            ? "border-green-500 bg-green-50"
                            : announcement.type === "support"
                              ? "border-yellow-500 bg-yellow-50"
                              : "border-gray-500 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{announcement.name}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            announcement.type === "general"
                              ? "bg-blue-100 text-blue-800"
                              : announcement.type === "account"
                                ? "bg-green-100 text-green-800"
                                : announcement.type === "support"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                        </span>
                      </div>
                      <div
                        className="text-gray-700 text-sm mb-3 [&>h1]:font-semibold [&>h1]:text-base [&>h1]:text-gray-900 [&>h1]:mt-2 [&>h1]:mb-1 [&>h2]:font-semibold [&>h2]:text-sm [&>h2]:text-gray-900 [&>h2]:mt-2 [&>h2]:mb-1 [&>h3]:font-semibold [&>h3]:text-sm [&>h3]:text-gray-900 [&>h3]:mt-2 [&>h3]:mb-1 [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ul]:ml-4 [&>ol]:mb-2 [&>ol]:ml-4 [&>li]:mb-1 [&>strong]:font-semibold [&>em]:italic [&>u]:underline [&>a]:text-blue-600 [&>a]:hover:text-blue-800 [&>a]:underline"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(announcement.message) }}
                      />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Learning Modules - DreamFlow Section */}
        {modules.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {currentCourse?.name || "Learning Modules"}
                </h2>
                <p className="text-gray-600">
                  {currentCourse?.description ||
                    "Progress through your certification modules with interactive content and guided tutorials."}
                </p>
              </div>
              <div className="p-4">
                <DreamFlow onComplete={handleCourseComplete} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Dashboard Grid - Implementation from image */}
        <div className="grid grid-cols-1 gap-8">
          {/* Need Help? */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-[30%] flex-shrink-0">
                <div className="relative w-48 h-48 mx-auto">
                  <img
                    src="https://i0.wp.com/www.notefull.com/wp-content/uploads/2017/05/NotefullJoseph-2-scaled.jpg?w=2114&ssl=1"
                    alt="Joseph - TOEFL Expert"
                    className="w-full h-full rounded-full object-cover shadow-xl ring-4 ring-[#c5a8de]/20"
                  />
                </div>
              </div>
              <div className="md:w-[70%] flex flex-col">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Need help/support from Joseph, our trusted expert?
                </h2>
                <p className="text-gray-600 mb-6">
                  Struggling, confused, or not improving? We'll get you back on track right away:
                </p>
                <a
                  href="https://calendly.com/notefulljoseph/toefl-course-help"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto bg-[#c5a8de] text-white py-4 px-8 rounded-lg font-medium hover:bg-[#b399d6] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule a Session with Joseph Here
                </a>
              </div>
            </div>
          </motion.div>

          {/* Send Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Send a Message to Joseph and the Dream Trainer Team
            </h2>
            <p className="text-gray-600 mb-6">
              Have a question or need assistance? Send us a message and we'll get back to you
              promptly.
            </p>
            <button
              onClick={() => setSupportMessageModalOpen(true)}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Send Message
            </button>
          </motion.div>
        </div>
      </div>

      {/* Welcome Modal */}
      <Modal
        isOpen={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
        title="Welcome to Dream Trainer!"
        size="xl"
        closeOnOverlayClick={false}
        closeOnEscape={false}
        showCloseButton={false}
      >
        <div className="p-8 text-center">
          {/* Vimeo Video */}
          <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden">
            <iframe
              src="https://player.vimeo.com/video/1114100368?h=a8cd5f3151&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Welcome to Dream Trainer"
              className="rounded-lg"
            ></iframe>
          </div>

          {/* Start Button */}
          <button
            onClick={() => {
              setWelcomeModalOpen(false);
              startTestMode();
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Start My First Test
          </button>
        </div>
      </Modal>

      {/* Support Message Modal */}
      <SupportMessageForm
        isOpen={supportMessageModalOpen}
        onClose={() => setSupportMessageModalOpen(false)}
      />
    </div>
  );
}

// Wrapper component that provides the Dashboard context
export default function Dashboard() {
  return (
    <DashboardProvider>
      <CourseProvider>
        <DashboardContent />
      </CourseProvider>
    </DashboardProvider>
  );
}

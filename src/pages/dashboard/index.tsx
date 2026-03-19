import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import {
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Calendar,
  Play,
  Mail,
  FileText,
  Download,
  Youtube,
  ExternalLink,
  User,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Globe,
  Music,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDashboardContext, DashboardProvider } from "../../contexts";
import { CourseProvider } from "../../contexts/CourseContext";
import { useCourseContext } from "../../contexts/useCourseContext";
import DreamFlow from "../../components/DreamFlow";
import Modal from "../../components/modals/Modal";
import SupportMessageForm from "../../components/forms/SupportMessageForm";
import { Section } from "../../types/modules";
import { CourseAsset, AssetType } from "../../types/course-assets";
import { getCourseBySlug, getCourseSectionsBySlug } from "../../services/api/modules";
import { sanitizeHtml } from "../../utils/htmlSanitizer";
import posthog from "posthog-js";

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// Get initials from a display name for avatar fallback
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const SOCIAL_LINKS = [
  {
    key: "youtube" as const,
    icon: Youtube,
    label: "YouTube",
    bg: "bg-red-100 hover:bg-red-200",
    color: "text-red-600",
  },
  {
    key: "linkedin" as const,
    icon: Linkedin,
    label: "LinkedIn",
    bg: "bg-blue-100 hover:bg-blue-200",
    color: "text-blue-700",
  },
  {
    key: "facebook" as const,
    icon: Facebook,
    label: "Facebook",
    bg: "bg-blue-100 hover:bg-blue-200",
    color: "text-blue-600",
  },
  {
    key: "instagram" as const,
    icon: Instagram,
    label: "Instagram",
    bg: "bg-pink-100 hover:bg-pink-200",
    color: "text-pink-600",
  },
  {
    key: "tiktok" as const,
    icon: Music,
    label: "TikTok",
    bg: "bg-gray-100 hover:bg-gray-200",
    color: "text-gray-900",
  },
  {
    key: "twitter" as const,
    icon: Twitter,
    label: "Twitter",
    bg: "bg-sky-100 hover:bg-sky-200",
    color: "text-sky-500",
  },
  {
    key: "website" as const,
    icon: Globe,
    label: "Website",
    bg: "bg-gray-100 hover:bg-gray-200",
    color: "text-gray-600",
  },
];

// Convert a raw YouTube or Vimeo watch URL to an embeddable URL
const toEmbedUrl = (url: string): string => {
  // YouTube: watch?v=ID or youtu.be/ID
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  // Vimeo: vimeo.com/ID or player.vimeo.com/video/ID
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  return url;
};

// Helper function to get file icon color based on AssetType
const getAssetTypeColor = (type: AssetType): string => {
  const colors: Record<AssetType, string> = {
    video: "text-pink-500",
    image: "text-blue-500",
    document: "text-red-500",
    audio: "text-purple-500",
    spreadsheet: "text-emerald-500",
    presentation: "text-orange-500",
    other: "text-gray-500",
  };
  return colors[type] || "text-gray-500";
};

// Course Resources Section Component
function CourseResourcesSection({ courseId }: { courseId?: string }) {
  const [resources, setResources] = useState<CourseAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call when endpoint is available
        // const data = await getCourseResources(courseId);
        // setResources(data);

        // Placeholder: Empty array until API is connected
        setResources([]);
      } catch (err) {
        console.error("Failed to fetch course resources:", err);
        setError("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [courseId]);

  // Don't render if no courseId or empty resources
  if (!courseId || resources.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mb-8"
    >
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Course Resources</h2>
          <p className="text-gray-600">
            Download supplementary materials, templates, and reference documents for this course.
          </p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-[#c5a8de]" />
              <span className="ml-2 text-gray-600">Loading resources...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-gray-600">{error}</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No resources available for this course yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Size
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr
                      key={resource.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <FileText className={`w-5 h-5 ${getAssetTypeColor(resource.type)}`} />
                          <div>
                            <p className="font-medium text-gray-900">{resource.name}</p>
                            {resource.description && (
                              <p className="text-sm text-gray-500">{resource.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="uppercase text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {resource.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatFileSize(resource.fileSize)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <a
                          href={resource.s3Key}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#c5a8de] hover:text-[#b399d6] hover:bg-[#f3eafd] rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DashboardContent() {
  const { slug } = useParams<{ slug: string }>();
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
  } = useCourseContext();

  // State for available sections within the current course
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [switchingSection, setSwitchingSection] = useState<string | null>(null);

  // Ref to track if initialization has been done to prevent duplicate calls
  const isInitialized = useRef(false);
  const lastCourseId = useRef<string | null>(null);

  // Load course and sections on component mount or when slug changes
  useEffect(() => {
    const initializeDashboard = async () => {
      // Use slug from URL params, fallback to localStorage for backward compatibility
      const targetSlug = slug || localStorage.getItem("selected_course_slug");

      // Skip if no slug or if we've already initialized with this course
      if (!targetSlug || (isInitialized.current && lastCourseId.current === targetSlug)) {
        return;
      }

      try {
        isInitialized.current = true;
        lastCourseId.current = targetSlug;

        const selectedSectionId = localStorage.getItem("selected_section_id");

        // Load the course from URL or localStorage
        // Note: loadCourse currently expects an ID, so we need to fetch the course by slug first
        // unless we update loadCourse to handle slugs.
        // For now, let's fetch the course to get the ID.
        const courseResponse = await getCourseBySlug(targetSlug);
        const courseData = courseResponse.data;
        await loadCourse(courseData.id);

        // Fetch sections for this course using the NEW slug-based API
        const sections = await getCourseSectionsBySlug(targetSlug);
        const sortedSections = sections.sort((a: Section, b: Section) => a.order - b.order);
        setAvailableSections(sortedSections);

        // Determine which section to load
        const sectionToLoad =
          selectedSectionId && sortedSections.some((s: Section) => s.id === selectedSectionId)
            ? selectedSectionId
            : sortedSections.length > 0
              ? sortedSections[0].id
              : null;

        // Load modules for the active section
        if (sectionToLoad) {
          await loadSectionModules(sectionToLoad);
          // Persist last visited course + section for the nav "Continue Learning" button
          localStorage.setItem("last_course_slug", targetSlug);
          localStorage.setItem("last_section_id", sectionToLoad);
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
  }, [slug]); // Only depend on slug - functions are stable via useCallback in context

  // Handle section switching
  const handleSwitchSection = async (sectionId: string) => {
    try {
      setSwitchingSection(sectionId);
      await loadSectionModules(sectionId);
      // Keep last_section_id in sync when user switches sections
      if (currentCourse) {
        localStorage.setItem("last_course_slug", currentCourse.slug);
        localStorage.setItem("last_section_id", sectionId);
      }
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {firstName}!</h1>
            <button
              onClick={() => setWelcomeModalOpen(true)}
              className="text-base font-medium bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md flex items-center flex-shrink-0"
            >
              <Play className="w-5 h-5 mr-2" /> Watch Your Welcome Video!
            </button>
          </div>
        </motion.div>

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

        {/* Announcements and Help Section - Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* General Announcements Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">General Announcements</h2>
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
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {announcement.name}
                          </h3>
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

          {/* Need Help? */}
          {currentCourse?.expertProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {(() => {
                const expert = currentCourse.expertProfile!;
                const activeSocials = SOCIAL_LINKS.filter(({ key }) => expert.socialLinks?.[key]);
                return (
                  <div className="flex flex-col gap-6 items-center text-center">
                    <div className="flex-shrink-0">
                      <div className="relative w-32 h-32 mx-auto">
                        {expert.avatarUrl ? (
                          <img
                            src={expert.avatarUrl}
                            alt={expert.displayName}
                            className="w-full h-full rounded-full object-cover shadow-xl ring-4 ring-[#c5a8de]/20"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-xl ring-4 ring-[#c5a8de]/20">
                            {expert.displayName ? (
                              <span className="text-white font-bold text-3xl">
                                {getInitials(expert.displayName)}
                              </span>
                            ) : (
                              <User className="w-12 h-12 text-white" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Need help/support from {expert.displayName}?
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Struggling, confused, or not improving? We'll get you back on track right
                        away:
                      </p>

                      {activeSocials.length > 0 && (
                        <div className="flex items-center justify-center gap-4 mb-4">
                          {activeSocials.map(({ key, icon: Icon, label, bg, color }) => (
                            <a
                              key={key}
                              href={expert.socialLinks[key]!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center transition-colors`}
                              title={label}
                            >
                              <Icon className={`w-5 h-5 ${color}`} />
                            </a>
                          ))}
                        </div>
                      )}

                      {expert.slug && (
                        <a
                          href={`/experts/${expert.slug}`}
                          className="text-[#c5a8de] hover:text-[#b399d6] text-sm font-medium flex items-center justify-center gap-1 mb-4"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View {expert.displayName}'s Full Profile
                        </a>
                      )}

                      {expert.calendarLink && (
                        <a
                          href={expert.calendarLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#c5a8de] text-white py-4 px-8 rounded-lg font-medium hover:bg-[#b399d6] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-md mb-4"
                        >
                          <Calendar className="w-5 h-5" />
                          Schedule a Session with {expert.displayName}
                        </a>
                      )}
                      <button
                        onClick={() => setSupportMessageModalOpen(true)}
                        className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg font-medium hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <Mail className="w-5 h-5" />
                        Send Message
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </div>

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

        {/* Course Resources Section */}
        <CourseResourcesSection courseId={currentCourse?.id} />
      </div>
      {/* Welcome Modal */}
      <Modal
        isOpen={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
        title={currentCourse?.name ? `Welcome to ${currentCourse?.name}!` : "Welcome!"}
        size="xl"
        closeOnOverlayClick={false}
        closeOnEscape={false}
        showCloseButton={false}
      >
        <div className="p-8 text-center">
          {/* Vimeo Video */}
          <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden">
            <iframe
              src={currentCourse?.welcomeVideoUrl ? toEmbedUrl(currentCourse.welcomeVideoUrl) : ""}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={currentCourse?.name ? `Welcome to ${currentCourse?.name}` : "Welcome!"}
              className="rounded-lg"
            ></iframe>
          </div>

          {/* Start Button */}
          <button
            onClick={() => {
              setWelcomeModalOpen(false);
            }}
            className="mt-3 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Let's Begin
          </button>
        </div>
      </Modal>
      <SupportMessageForm
        courseId={currentCourse?.id}
        expertName={currentCourse?.expertProfile?.displayName}
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

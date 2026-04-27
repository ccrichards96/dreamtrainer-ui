import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Loader2,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Target,
  ListChecks,
  Users,
} from "lucide-react";
import { isEnrolledInCourse } from "../../services/api/enrollment";
import { useCheckoutContext } from "../../contexts";
import ExpertProfileCard from "../../components/ExpertProfileCard";
import CourseSectionsPreview from "../../components/CourseSectionsPreview";
import type { Course } from "../../types/modules";
import type { CoursePricing } from "../../types/billing";

export default function CourseProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { loadCheckoutData } = useCheckoutContext();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [pricing, setPricing] = useState<CoursePricing | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setLoadingPricing(true);
        setError(null);

        // Load course and pricing through checkout context (caches data for checkout page)
        const checkoutData = await loadCheckoutData(slug);
        setCourse(checkoutData.course);
        setPricing(checkoutData.pricing);
        setLoadingPricing(false);

        // Only check enrollment if the user is authenticated
        if (isAuthenticated) {
          setCheckingEnrollment(true);
          try {
            const enrolled = await isEnrolledInCourse(checkoutData.course.id);
            setIsEnrolled(enrolled);
          } catch (err) {
            console.warn("Failed to check enrollment:", err);
            setIsEnrolled(false);
          }
        } else {
          // Guest user — not enrolled by definition
          setIsEnrolled(false);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err instanceof Error ? err.message : "Failed to load course");
      } finally {
        setLoading(false);
        setLoadingPricing(false);
        setCheckingEnrollment(false);
      }
    };

    fetchCourse();
  }, [slug, loadCheckoutData, isAuthenticated]);

  /**
   * Determine CTA button label and action based on auth state + pricing
   */
  const isFree = !pricing || pricing.amount === 0;

  const handleJoinCourse = () => {
    if (!course) return;

    if (isEnrolled) {
      // Already enrolled → go to course dashboard
      navigate(`/courses/${course.slug}/dashboard`);
      return;
    }

    if (!isAuthenticated) {
      // Not signed in → redirect to Auth0 signup, then return to this course page
      loginWithRedirect({
        authorizationParams: { screen_hint: "signup" },
        appState: { returnTo: `/courses/${slug}` },
      });
      return;
    }

    // Signed in, not enrolled → go to checkout (handles both free enrollment and paid)
    navigate(`/courses/${course.slug}/checkout`);
  };

  /**
   * Get the CTA button label based on current state
   */
  const getButtonLabel = (): string => {
    if (isEnrolled) return "Continue Learning";

    if (!isAuthenticated) {
      // Guest user
      return isFree ? "Sign Up to Join Course" : "Sign Up to Join with a Free 3-day Trial";
    }

    // Authenticated user
    return isFree ? "Join Course" : "Join with a Free 3-day Trial";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#c5a8de]" />
            <span className="ml-3 text-gray-600">Loading course...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error || "Course not found"}</p>
            <button
              onClick={() => navigate("/courses")}
              className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/courses")}
            className="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center gap-2"
          >
            ← Back to Courses
          </button>
        </div>

        {/* Course Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="md:col-span-2 space-y-6">
            {/* Course Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.name}</h1>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </div>

            {/* Course Image or Video */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative w-full aspect-video bg-gradient-to-br from-[#c5a8de] to-[#b399d6]">
                {course.featuredVideoUrl ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={
                      course.featuredVideoUrl.includes("watch?v=")
                        ? course.featuredVideoUrl.replace("watch?v=", "embed/")
                        : course.featuredVideoUrl.includes("youtu.be/")
                          ? course.featuredVideoUrl.replace("youtu.be/", "youtube.com/embed/")
                          : course.featuredVideoUrl
                    }
                    title={course.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white opacity-20">
                    <BookOpen className="w-32 h-32" />
                  </div>
                )}
              </div>
            </div>

            {/* Course Plan Details */}
            {(course.learningObjectives?.length !== 0 ||
              course.prerequisites?.length !== 0 ||
              course.targetAudiences?.length !== 0) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Learning Objectives */}
                  {course.learningObjectives && course.learningObjectives.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="size-5 text-purple-600" />
                        <h3 className="text-sm font-bold text-gray-900">What You'll Learn</h3>
                      </div>
                      <ul className="space-y-2">
                        {course.learningObjectives.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ListChecks className="size-5 text-purple-600" />
                        <h3 className="text-sm font-bold text-gray-900">Prerequisites</h3>
                      </div>
                      <ul className="space-y-2">
                        {course.prerequisites.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-gray-400">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Target Audience */}
                  {course.targetAudiences && course.targetAudiences.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="size-5 text-purple-600" />
                        <h3 className="text-sm font-bold text-gray-900">Who This Is For</h3>
                      </div>
                      <ul className="space-y-2">
                        {course.targetAudiences.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-gray-400 mr-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Expert Profile Card */}
            {course.expertProfile && <ExpertProfileCard expertProfile={course.expertProfile} />}
          </div>

          {/* Sidebar - Right Side */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    {loadingPricing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        <span className="text-lg text-gray-400">Loading price...</span>
                      </div>
                    ) : (
                      <span className="text-4xl font-bold text-gray-900">
                        {pricing ? (
                          pricing.amount > 0 ? (
                            <>
                              {pricing.currency === "usd"
                                ? "$"
                                : pricing.currency.toUpperCase() + " "}
                              {pricing.amount.toFixed(2)}
                            </>
                          ) : (
                            "Free"
                          )
                        ) : (
                          "Free"
                        )}
                      </span>
                    )}
                  </div>
                  {!loadingPricing && pricing && (
                    <p className="text-sm text-gray-600">
                      {pricing.type === "recurring" && pricing.recurring
                        ? pricing.recurring.intervalCount === 1
                          ? `Billed ${pricing.recurring.interval}ly`
                          : `Billed every ${pricing.recurring.intervalCount} ${pricing.recurring.interval}s`
                        : pricing.amount > 0
                          ? "One-time purchase"
                          : null}
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleJoinCourse}
                  disabled={checkingEnrollment}
                  className="w-full py-4 px-6 inline-flex items-center justify-center gap-x-2 text-lg font-semibold rounded-lg border border-transparent bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100"
                >
                  {checkingEnrollment ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      {getButtonLabel()}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Additional Info */}
                {isEnrolled && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      You're enrolled in this course
                    </p>
                  </div>
                )}
              </div>

              {/* Course Stats */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What You'll Get</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {course.sections?.length ?? course.numberOfSections ?? 0} Section
                        {(course.sections?.length ?? course.numberOfSections ?? 0) !== 1 ? "s" : ""}
                      </p>
                      <p className="text-sm text-gray-600">Comprehensive curriculum</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Sections Preview */}
              <CourseSectionsPreview sections={course.sections} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

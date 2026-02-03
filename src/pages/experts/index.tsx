import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  User,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Music,
  Calendar,
  BookOpen,
  ArrowRight,
  Star,
} from "lucide-react";
import { getExpertBySlug } from "../../services/api/experts";
import type { ExpertProfile, ExpertSocialLinks, ExpertReview, Course } from "../../types/modules";

/**
 * Get initials from a display name for avatar fallback
 */
function getInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return displayName.slice(0, 2).toUpperCase();
}

/**
 * Social link icon component
 */
function SocialLinkIcon({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors duration-200"
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

/**
 * Renders social links as icon buttons
 */
function SocialLinks({ socialLinks }: { socialLinks: ExpertSocialLinks }) {
  const links: Array<{
    key: keyof ExpertSocialLinks;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }> = [
    { key: "linkedin", icon: Linkedin, label: "LinkedIn" },
    { key: "twitter", icon: Twitter, label: "Twitter" },
    { key: "facebook", icon: Facebook, label: "Facebook" },
    { key: "instagram", icon: Instagram, label: "Instagram" },
    { key: "youtube", icon: Youtube, label: "YouTube" },
    { key: "tiktok", icon: Music, label: "TikTok" },
    { key: "website", icon: Globe, label: "Website" },
  ];

  const activeLinks = links.filter((link) => socialLinks[link.key]);

  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {activeLinks.map((link) => (
        <SocialLinkIcon
          key={link.key}
          href={socialLinks[link.key]!}
          icon={link.icon}
          label={link.label}
        />
      ))}
    </div>
  );
}

/**
 * Course card for expert's courses
 */
function ExpertCourseCard({ course, onClick }: { course: Course; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Course Image */}
        <div className="sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-[#c5a8de] to-[#b399d6] flex-shrink-0 flex items-center justify-center">
          {course.imageUrl ? (
            <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" />
          ) : (
            <BookOpen className="w-12 h-12 text-white opacity-30" />
          )}
        </div>

        {/* Course Info */}
        <div className="flex-1 p-4 flex flex-col justify-center">
          <h3 className="font-semibold text-gray-900 mb-1">{course.name}</h3>
          {course.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-purple-600 text-sm font-medium inline-flex items-center gap-1">
              View Course <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Star rating display component
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Review card for expert reviews
 */
function ReviewCard({ review }: { review: ExpertReview }) {
  const studentName = review.studentUser
    ? `${review.studentUser.firstName} ${review.studentUser.lastName}`.trim()
    : "Anonymous Student";

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
      {/* Header: Avatar, Name, Date, Rating */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {review.studentUser?.avatarUrl ? (
            <img
              src={review.studentUser.avatarUrl}
              alt={studentName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {studentName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Name, Date, Rating */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="font-medium text-gray-900 truncate">{studentName}</h4>
            <StarRating rating={review.rating} />
          </div>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </div>

      {/* Review Comment */}
      {review.comment && (
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      )}

      {/* Instructor Reply */}
      {review.commentReply && (
        <div className="mt-4 pl-4 border-l-2 border-purple-200 bg-purple-50/50 rounded-r-lg p-3">
          <p className="text-sm font-medium text-purple-700 mb-1">Instructor Reply</p>
          <p className="text-sm text-gray-700">{review.commentReply}</p>
        </div>
      )}
    </div>
  );
}

export default function ExpertProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<ExpertReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpert = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch expert profile
        const expertData = await getExpertBySlug(slug);
        setExpert(expertData);

        // Set courses from expert data
        setCourses(expertData.courses || []);

        // Set reviews from expert data
        setReviews(expertData.reviews || []);
      } catch (err) {
        console.error("Error fetching expert:", err);
        setError(err instanceof Error ? err.message : "Failed to load expert profile");
      } finally {
        setLoading(false);
      }
    };

    fetchExpert();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#c5a8de]" />
            <span className="ml-3 text-gray-600">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error || "Expert not found"}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Cover/Banner Area */}
          <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600" />

          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Avatar - Overlapping the banner */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 mb-4">
              <div className="flex-shrink-0">
                {expert.avatarUrl ? (
                  <img
                    src={expert.avatarUrl}
                    alt={expert.displayName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
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

              {/* Name and Title area */}
              <div className="flex-1 pt-4 sm:pt-0 sm:pb-2">
                <h1 className="text-2xl font-bold text-gray-900">{expert.displayName}</h1>
              </div>
            </div>

            {/* Bio */}
            {expert.bio && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{expert.bio}</p>
              </div>
            )}

            {/* Social Links & Calendar */}
            <div className="flex flex-wrap items-center gap-4">
              {expert.socialLinks && <SocialLinks socialLinks={expert.socialLinks} />}

              {expert.calendarLink && (
                <a
                  href={expert.calendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Book a Session
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Courses Section */}
        {courses.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Courses by {expert.displayName}
            </h2>
            <div className="space-y-4">
              {courses.map((course) => (
                <ExpertCourseCard
                  key={course.id}
                  course={course}
                  onClick={() => navigate(`/courses/${course.slug}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Student Reviews
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} average
                </span>
                <span className="text-gray-400">·</span>
                <span>{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

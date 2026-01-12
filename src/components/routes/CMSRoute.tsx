import React, { useEffect } from "react";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import { useStoryblok, getStoryblokVersion } from "../../utils/storyblok";
import { StoryblokComponent } from "@storyblok/react";

const CMSRoute: React.FC = () => {
  const { "*": wildcard } = useParams<{ "*": string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Capture referralId from URL and store in localStorage for affiliate tracking
  useEffect(() => {
    const referralId = searchParams.get("referralId");
    if (referralId) {
      localStorage.setItem("rewardful_referral_id", referralId);
    }
  }, [searchParams]);

  let fullSlug = "home"; // Default to home

  if (location.pathname.startsWith("/site/")) {
    // For /site/ prefixed routes, use the path after /site/
    fullSlug = location.pathname.replace(/^\/site\/?/, "") || "home";
  } else if (wildcard) {
    // Handle other wildcard cases
    fullSlug = wildcard;
  }

  const story = useStoryblok(fullSlug, {
    version: getStoryblokVersion(),
  });

  if (!story?.content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {fullSlug}...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StoryblokComponent blok={story.content} />
    </div>
  );
};

export default CMSRoute;

import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useStoryblok } from '../../utils/storyblok';
import { StoryblokComponent } from "@storyblok/react";

const CMSRoute: React.FC = () => {
  const { "*": wildcard } = useParams<{ "*": string }>();
  const location = useLocation();

  let fullSlug = 'home'; // Default to home
  
  if (location.pathname.startsWith('/site/')) {
    // For /site/ prefixed routes, use the path after /site/
    fullSlug = location.pathname.replace(/^\/site\/?/, '') || 'home';
  } else if (wildcard) {
    // Handle other wildcard cases
    fullSlug = wildcard;
  }
  
  const story = useStoryblok(fullSlug, {
    version: import.meta.env.DEV ? 'draft' : 'published'
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

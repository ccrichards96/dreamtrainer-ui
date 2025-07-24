import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useStoryblok } from '../../utils/storyblok';
import { StoryblokComponent } from "@storyblok/react";

const CMSRoute: React.FC = () => {
  const { "*": wildcard } = useParams<{ "*": string }>();
  const location = useLocation();
  
  // Extract the full slug from the location pathname
  // Remove the '/p/' prefix to get the actual slug
  const fullSlug = wildcard || location.pathname.replace(/^\/p\/?/, '') || 'home';
  
  // console.log('CMSRoute - wildcard:', wildcard);
  // console.log('CMSRoute - location.pathname:', location.pathname);
  // console.log('CMSRoute - fullSlug:', fullSlug);
  
  // Use the useStoryblok hook which handles both fetching and bridge
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
      {/* {import.meta.env.DEV && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">Debug Info:</p>
          <p>Slug: {fullSlug}</p>
          <p>Story UUID: {story.uuid}</p>
          <p>Content Type: {story.content.component}</p>
          {story.content.component === 'post' && (
            <div>
              <p>Layout Style: {story.content.layout_style}</p>
              <p>Image: {JSON.stringify(story.content.image)}</p>
            </div>
          )}
        </div>
      )} */}
      <StoryblokComponent blok={story.content} />
    </div>
  );
};

export default CMSRoute;

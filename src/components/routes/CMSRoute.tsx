import React from 'react';
import { useParams } from 'react-router-dom';
import { useStoryblok } from '../../utils/storyblok';
import { StoryblokComponent } from "@storyblok/react";

const CMSRoute: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Use the useStoryblok hook which handles both fetching and bridge
  const story = useStoryblok(slug || 'home', {
    version: import.meta.env.DEV ? 'draft' : 'published'
  });

  if (!story?.content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

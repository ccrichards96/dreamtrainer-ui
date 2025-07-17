import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStoryblokApi } from '../utils/storyblok';
import { StoryblokComponent } from "@storyblok/react";

interface Story {
  content: {
    _uid: string;
    component: string;
    [key: string]: any;
  };
  name: string;
  full_slug: string;
  uuid: string;
  id: number;
}

const CMSRoute: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const storyblokApi = getStoryblokApi();
        
        const { data } = await storyblokApi.get(`cdn/stories/${slug || 'home'}`, {
          version: import.meta.env.DEV ? 'draft' : 'published'
        });

        setStory(data.story);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page');
      } finally {
        setIsLoading(false);
      }
    };

    getStory();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-gray-600">The requested page could not be found.</p>
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

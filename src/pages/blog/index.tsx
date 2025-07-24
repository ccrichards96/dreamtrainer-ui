import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useStoryblokApi } from '../../utils/storyblok';
import type { ISbStoryData } from '@storyblok/react';

interface BlogStory extends ISbStoryData {
  content: {
    component: string;
    title?: string;
    intro?: string;
    image?: string | { filename: string };
    category?: string;
    date?: string;
    author?: string;
    [key: string]: unknown;
  };
}

export default function BlogPage() {
  const [stories, setStories] = useState<BlogStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const storyblokApi = useStoryblokApi();

  // Helper function to get image URL from Storyblok asset
  const getImageUrl = (image: string | { filename: string } | null | undefined): string => {
    if (!image) return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=560&q=80';
    if (typeof image === 'string') return image;
    if (typeof image === 'object' && image.filename) return image.filename;
    return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=560&q=80';
  };

  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Truncate text for preview
  const truncateText = (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch all stories with component type 'post'
        const { data } = await storyblokApi.get('cdn/stories', {
          version: import.meta.env.DEV ? 'draft' : 'published',
          filter_query: {
            component: {
              in: 'post'
            }
          },
          sort_by: 'created_at:desc',
          per_page: 100
        });

        setStories(data.stories || []);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (storyblokApi) {
      fetchPosts();
    }
  }, [storyblokApi]);

  const handlePostClick = (story: BlogStory) => {
    // Navigate to the post using the full slug
    navigate(`/p/${story.full_slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-32">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Dream Trainer{' '}
            <span className="text-green-400 bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="text-xl text-white leading-relaxed">
            Stay in the know with insights from industry experts on goal achievement, 
            personal development, and AI-powered coaching.
          </p>
        </div>
      </section>

      {/* Card Blog */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="text-2xl font-bold md:text-4xl md:leading-tight">
            Latest Articles
          </h2>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Discover strategies, tips, and success stories to help you achieve your dreams.
          </p>
          {stories.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {stories.length} article{stories.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
        {/* End Title */}

        {/* Grid */}
        {stories.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, index) => {
              const imageUrl = getImageUrl(story.content.image);
              const isSpecialCard = index === 2; // Make every 3rd card special

              if (isSpecialCard) {
                // Special card with background image
                return (
                  <button
                    key={story.id}
                    onClick={() => handlePostClick(story)}
                    className="group relative flex flex-col w-full min-h-60 bg-center bg-cover rounded-xl hover:shadow-lg focus:outline-hidden focus:shadow-lg transition cursor-pointer"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(${imageUrl})`
                    }}
                  >
                    <div className="flex-auto p-4 md:p-6">
                      <h3 className="text-xl text-white/90 group-hover:text-white">
                        <span className="font-bold">{story.content.title || story.name}</span>
                        {story.content.intro && (
                          <span className="block mt-2 text-base font-normal">
                            {truncateText(story.content.intro, 100)}
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="pt-0 p-4 md:p-6">
                      <div className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:text-white/70 group-focus:text-white/70">
                        Read article
                        <ChevronRight className="shrink-0 h-4 w-4" />
                      </div>
                      {story.content.date && (
                        <p className="mt-2 text-xs text-white/70">
                          {formatDate(story.content.date)}
                        </p>
                      )}
                    </div>
                  </button>
                );
              }

              // Regular card
              return (
                <button
                  key={story.id}
                  onClick={() => handlePostClick(story)}
                  className="group flex flex-col focus:outline-hidden cursor-pointer text-left"
                >
                  <div className="relative pt-[50%] sm:pt-[70%] rounded-xl overflow-hidden">
                    <img 
                      className="size-full absolute top-0 start-0 object-cover group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out rounded-xl" 
                      src={imageUrl}
                      alt={story.content.title || story.name}
                      loading="lazy"
                    />
                    {story.content.category && (
                      <span className="absolute top-0 end-0 rounded-se-xl rounded-es-xl text-xs font-medium bg-gray-800 text-white py-1.5 px-3 dark:bg-neutral-900">
                        {story.content.category}
                      </span>
                    )}
                  </div>

                  <div className="mt-7">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 dark:group-hover:text-blue-400">
                      {story.content.title || story.name}
                    </h3>
                    {story.content.intro && (
                      <p className="mt-3 dark:text-neutral-800">
                        {truncateText(story.content.intro)}
                      </p>
                    )}
                    
                    {/* Author and Date */}
                    {(story.content.author || story.content.date) && (
                      <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-neutral-400">
                        {story.content.author && (
                          <span>By {story.content.author}</span>
                        )}
                        {story.content.author && story.content.date && (
                          <span className="mx-2">•</span>
                        )}
                        {story.content.date && (
                          <span>{formatDate(story.content.date)}</span>
                        )}
                      </div>
                    )}
                    
                    <p className="mt-5 inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 group-hover:underline group-focus:underline font-medium dark:text-blue-500">
                      Read more
                      <ChevronRight className="shrink-0 h-4 w-4" />
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No blog posts yet</h3>
            <p className="text-gray-500">
              Check back later for insights and updates from our team.
            </p>
          </div>
        )}
        {/* End Grid */}
      </div>
      {/* End Card Blog */}

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest insights and tips delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Subscribe
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-4">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </section>
    </motion.div>
  );
}

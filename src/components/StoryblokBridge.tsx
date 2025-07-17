import { useEffect } from 'react';
import { storyblokInit, apiPlugin } from '@storyblok/react';

declare global {
  interface Window {
    StoryblokBridge: any;
  }
}

interface StoryblokBridgeProps {
  onStoryChange?: () => void;
}

const StoryblokBridge: React.FC<StoryblokBridgeProps> = ({ onStoryChange }) => {
  useEffect(() => {
    // Initialize the Storyblok Bridge only in development
    if (import.meta.env.DEV) {
      const { StoryblokBridge } = window;
      if (typeof StoryblokBridge !== 'undefined') {
        const bridge = new StoryblokBridge();

        bridge.on(['input', 'published', 'change'], () => {
          // Reload the content on change
          console.log('Story changed in editor');
          onStoryChange?.();
        });
      }
    }
  }, [onStoryChange]);

  return null;
};

export default StoryblokBridge;

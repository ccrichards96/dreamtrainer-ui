import { useEffect } from "react";

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
    if (import.meta.env.MODE === "development" || import.meta.env.MODE === "staging") {
      const { StoryblokBridge } = window;
      if (typeof StoryblokBridge !== "undefined") {
        const bridge = new StoryblokBridge();
        bridge.on(["input", "published", "change"], () => {
          onStoryChange?.();
        });
      }
    }
  }, [onStoryChange]);

  return null;
};

export default StoryblokBridge;

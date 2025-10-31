import React from "react";

interface VideoBlok {
  title?: string;
  link: string | { url?: string; cached_url?: string; linktype?: string }; // Vimeo link
  width?: number | string;
  height?: number | string;
  _uid: string;
  component: string;
}

const VideoComponent: React.FC<{ blok: VideoBlok }> = ({ blok }) => {
  // Default dimensions
  const defaultWidth = 640;
  const defaultHeight = 360;

  // Helper function to extract URL from Storyblok link
  const getLinkUrl = (
    link:
      | string
      | { url?: string; cached_url?: string; linktype?: string }
      | undefined,
  ): string => {
    if (!link) return "";
    if (typeof link === "string") return link;
    if (typeof link === "object") {
      return link.url || link.cached_url || "";
    }
    return "";
  };

  // Parse width and height, defaulting to numeric values if not provided
  const getWidth = (): string => {
    if (!blok.width) return `${defaultWidth}px`;
    if (typeof blok.width === "number") return `${blok.width}px`;
    return blok.width;
  };

  const getHeight = (): string => {
    if (!blok.height) return `${defaultHeight}px`;
    if (typeof blok.height === "number") return `${blok.height}px`;
    return blok.height;
  };

  // Extract Vimeo video ID from the link
  const getVimeoEmbedUrl = (link: string): string => {
    if (!link) return "";
    
    // Handle various Vimeo URL formats
    // https://vimeo.com/123456789
    // https://player.vimeo.com/video/123456789
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
    const match = link.match(vimeoRegex);
    
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
    
    // If already an embed URL, return as is
    if (link.includes("player.vimeo.com")) {
      return link;
    }
    
    // Fallback to the original link
    return link;
  };

  const linkUrl = getLinkUrl(blok.link);
  const embedUrl = getVimeoEmbedUrl(linkUrl);

  return (
    <div className="video-container">
      <div className="relative overflow-hidden rounded-lg shadow-md">
        <iframe
          src={embedUrl}
          width={getWidth()}
          height={getHeight()}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full"
          title={blok.title || "Video"}
        />
      </div>
    </div>
  );
};

export default VideoComponent;

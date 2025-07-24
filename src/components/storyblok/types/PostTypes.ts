/**
 * Type definitions for Storyblok Post component
 * Following Preline UI blog article design patterns
 */

import { SbBlokData } from "@storyblok/react";

export interface AuthorBlok {
  /** Author's full name */
  name?: string;
  
  /** Author biography/description */
  bio?: string;
  
  /** Author profile image */
  image?: {
    filename: string;
  };
  
  /** Number of articles written */
  articles_count?: string;
  
  /** Number of social followers */
  followers_count?: string;
  
  /** Social media links */
  social_links?: Array<SocialLinkBlok>;
}

export interface SocialLinkBlok {
  /** Social media platform */
  platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram';
  
  /** Profile URL */
  url: string;
}

export interface TagBlok {
  /** Tag name */
  name: string;
  
  /** Optional tag URL */
  url?: string;
}

export interface PostBlok extends SbBlokData {
  // Basic Content
  /** Article title */
  title?: string;
  
  /** Article subtitle/introduction */
  intro?: string;
  
  /** Featured article image */
  image?: string | { filename: string };
  
  /** Article category */
  category?: string;
  
  /** Main article content */
  long_text?: {
    type: 'doc';
    content: Array<{
      type: string;
      content?: Array<unknown>;
      text?: string;
      [key: string]: unknown;
    }>;
  };
  
  /** Additional content blocks */
  blocks?: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;
  
  // Author Information (Legacy Support)
  /** Author name (legacy field) */
  author?: string;
  
  /** Author image (legacy field) */
  author_image?: {
    filename: string;
  };
  
  /** Enhanced author details */
  author_details?: AuthorBlok;
  
  /** Publication date */
  date?: string;
  
  /** Reading time in minutes */
  read_time?: string;
  
  // Content Organization
  /** Article tags */
  tags?: Array<TagBlok>;
  
  // Layout Options
  /** Article layout style */
  layout_style?: LayoutStyle;
  
  /** Content container maximum width */
  container_max_width?: ContainerMaxWidth;
  
  /** Show navigation breadcrumbs */
  show_breadcrumbs?: boolean;
  
  /** Show social share buttons */
  show_social_share?: boolean;
  
  /** Show sticky share bar */
  show_sticky_share?: boolean;
  
  // Social Engagement
  /** Number of likes */
  likes_count?: string;
  
  /** Number of comments */
  comments_count?: string;
}

// Type definitions for options
export type LayoutStyle = 'hero' | 'simple';

export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export type SocialPlatform = 'twitter' | 'facebook' | 'linkedin' | 'instagram';

/**
 * Props for the Post component
 */
export interface PostComponentProps {
  blok: PostBlok;
}

/**
 * Default values for the Post component
 */
export const PostDefaults: Partial<PostBlok> = {
  layout_style: 'simple',
  container_max_width: '3xl',
  show_breadcrumbs: true,
  show_social_share: false,
  show_sticky_share: false,
  likes_count: '0',
  comments_count: '0',
} as const;

/**
 * Utility type for creating post bloks with type safety
 */
export type CreatePostBlok = (config: {
  title: string;
  long_text: PostBlok['long_text'];
} & Partial<Omit<PostBlok, 'title' | 'long_text'>>) => PostBlok;

/**
 * Helper function to create properly typed post bloks
 */
export const createPostBlok: CreatePostBlok = (config) => ({
  ...PostDefaults,
  ...config,
});

/**
 * Post layout presets for different content types
 */
export const PostPresets = {
  /** Standard blog article */
  article: (title: string, content: PostBlok['long_text']): PostBlok => createPostBlok({
    title,
    long_text: content,
    layout_style: 'simple',
    show_breadcrumbs: true,
    container_max_width: '2xl',
  }),
  
  /** Featured article with hero layout */
  featured: (title: string, content: PostBlok['long_text'], image: string): PostBlok => createPostBlok({
    title,
    long_text: content,
    image,
    layout_style: 'hero',
    show_social_share: true,
    show_sticky_share: true,
    container_max_width: '3xl',
  }),
  
  /** News/announcement post */
  news: (title: string, content: PostBlok['long_text'], category: string): PostBlok => createPostBlok({
    title,
    long_text: content,
    category,
    layout_style: 'simple',
    show_breadcrumbs: true,
    show_social_share: true,
    container_max_width: '2xl',
  }),
  
  /** Tutorial/guide content */
  tutorial: (title: string, content: PostBlok['long_text'], readTime: string): PostBlok => createPostBlok({
    title,
    long_text: content,
    read_time: readTime,
    layout_style: 'simple',
    show_breadcrumbs: true,
    container_max_width: 'xl',
  }),
} as const;

/**
 * Author profile presets
 */
export const AuthorPresets = {
  /** Basic author profile */
  basic: (name: string, image: string): AuthorBlok => ({
    name,
    image: { filename: image },
  }),
  
  /** Enhanced author profile with social stats */
  enhanced: (name: string, image: string, bio: string, articles: string, followers: string): AuthorBlok => ({
    name,
    image: { filename: image },
    bio,
    articles_count: articles,
    followers_count: followers,
  }),
  
  /** Author with social links */
  withSocial: (name: string, image: string, bio: string, socialLinks: Array<SocialLinkBlok>): AuthorBlok => ({
    name,
    image: { filename: image },
    bio,
    social_links: socialLinks,
  }),
} as const;

/**
 * Helper functions for social interactions
 */
export const SocialInteractions = {
  /** Format count numbers for display */
  formatCount: (count?: string): string => {
    if (!count) return '0';
    const num = parseInt(count);
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return count;
  },
  
  /** Generate social share URLs */
  getShareUrl: (platform: SocialPlatform, url: string, title?: string): string => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title || '');
    
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      default:
        return url;
    }
  },
} as const;

/**
 * Validation helpers
 */
export const PostValidation = {
  /** Validate required fields for publication */
  validateForPublication: (blok: PostBlok): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!blok.title?.trim()) {
      errors.push('Title is required');
    }
    
    if (!blok.long_text || !blok.long_text.content?.length) {
      errors.push('Article content is required');
    }
    
    if (blok.layout_style === 'hero' && !blok.image) {
      errors.push('Hero layout requires a featured image');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
  
  /** Estimate reading time from content */
  estimateReadingTime: (content?: PostBlok['long_text']): number => {
    if (!content?.content) return 0;
    
    const wordsPerMinute = 200;
    const textContent = JSON.stringify(content.content);
    const wordCount = textContent.split(/\s+/).length;
    
    return Math.ceil(wordCount / wordsPerMinute);
  },
} as const;

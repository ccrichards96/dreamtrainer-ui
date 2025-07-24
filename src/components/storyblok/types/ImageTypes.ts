/**
 * Type definitions for Storyblok Image component
 * Following Preline UI design patterns
 */

export interface ImageBlok {
  /** Required image asset */
  image_url: {
    filename: string;
  };
  
  /** Accessibility alt text */
  alt?: string;
  
  // Legacy dimension fields (maintained for backward compatibility)
  width?: string;
  height?: string;
  borderRadius?: string;
  boxsize_base?: string;
  
  // Preline UI design pattern fields
  /** How the image should fit within its container */
  objectFit?: ObjectFitOption;
  
  /** Predefined aspect ratio */
  aspectRatio?: AspectRatioOption;
  
  /** Shadow depth */
  shadow?: ShadowOption;
  
  /** Border radius */
  rounded?: RoundedOption;
  
  /** Hover animation effect */
  hoverEffect?: HoverEffectOption;
  
  /** Maximum width constraint */
  maxWidth?: string;
  
  /** Image loading behavior */
  loading?: LoadingOption;
  
  /** CSS display property */
  displayMode?: DisplayModeOption;
  
  /** Container background color (Tailwind class) */
  containerBackground?: string;
  
  /** Enable overlay */
  overlay?: boolean;
  
  /** Overlay color (Tailwind class) */
  overlayColor?: string;
  
  /** Overlay opacity percentage */
  overlayOpacity?: OpacityOption;
}

// Type definitions for dropdown options
export type ObjectFitOption = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

export type AspectRatioOption = 'square' | 'video' | 'photo' | 'auto';

export type ShadowOption = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type RoundedOption = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export type HoverEffectOption = 'none' | 'zoom' | 'opacity' | 'scale';

export type LoadingOption = 'lazy' | 'eager';

export type DisplayModeOption = 'block' | 'inline';

export type OpacityOption = '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90';

/**
 * Props for the Image component
 */
export interface ImageComponentProps {
  blok: ImageBlok;
}

/**
 * Default values for the Image component
 */
export const ImageDefaults: Partial<ImageBlok> = {
  objectFit: 'cover',
  loading: 'lazy',
  displayMode: 'block',
  shadow: 'none',
  rounded: 'none',
  hoverEffect: 'none',
  aspectRatio: 'auto',
  overlay: false,
  overlayOpacity: '30',
  overlayColor: 'black',
} as const;

/**
 * Utility type for creating image bloks with type safety
 */
export type CreateImageBlok = (config: {
  image_url: { filename: string };
  alt?: string;
} & Partial<Omit<ImageBlok, 'image_url' | 'alt'>>) => ImageBlok;

/**
 * Helper function to create properly typed image bloks
 */
export const createImageBlok: CreateImageBlok = (config) => ({
  ...ImageDefaults,
  ...config,
});

/**
 * Common image configurations for different use cases
 */
export const ImagePresets = {
  avatar: (filename: string, alt: string): ImageBlok => createImageBlok({
    image_url: { filename },
    alt,
    aspectRatio: 'square',
    objectFit: 'cover',
    rounded: 'full',
    shadow: 'md',
    hoverEffect: 'zoom',
  }),
  
  hero: (filename: string, alt: string): ImageBlok => createImageBlok({
    image_url: { filename },
    alt,
    aspectRatio: 'video',
    objectFit: 'cover',
    loading: 'eager',
    overlay: true,
    overlayOpacity: '30',
  }),
  
  thumbnail: (filename: string, alt: string): ImageBlok => createImageBlok({
    image_url: { filename },
    alt,
    aspectRatio: 'square',
    objectFit: 'cover',
    rounded: 'lg',
    shadow: 'lg',
    hoverEffect: 'scale',
  }),
  
  gallery: (filename: string, alt: string): ImageBlok => createImageBlok({
    image_url: { filename },
    alt,
    aspectRatio: 'photo',
    objectFit: 'cover',
    rounded: 'md',
    shadow: 'md',
    hoverEffect: 'opacity',
  }),
  
  basic: (filename: string, alt: string): ImageBlok => createImageBlok({
    image_url: { filename },
    alt,
    objectFit: 'cover',
    rounded: 'md',
  }),
} as const;

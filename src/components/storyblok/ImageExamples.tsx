// Example usage of the enhanced Image component with Preline UI patterns

import React from "react";
import ImageComponent from "./Image";

// Example 1: Basic responsive image
const basicImageBlok = {
  image_url: {
    filename:
      "https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?auto=format&fit=crop&w=800&q=80",
  },
  alt: "Mountain landscape",
  objectFit: "cover" as const,
  rounded: "lg" as const,
  shadow: "md" as const,
  loading: "lazy" as const,
};

// Example 2: Square avatar with hover effect
const avatarImageBlok = {
  image_url: {
    filename:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80",
  },
  alt: "User profile photo",
  aspectRatio: "square" as const,
  objectFit: "cover" as const,
  rounded: "full" as const,
  shadow: "lg" as const,
  hoverEffect: "zoom" as const,
  maxWidth: "200px",
};

// Example 3: Hero image with overlay
const heroImageBlok = {
  image_url: {
    filename:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
  },
  alt: "City skyline hero image",
  aspectRatio: "video" as const,
  objectFit: "cover" as const,
  overlay: true,
  overlayOpacity: "30" as const,
  hoverEffect: "scale" as const,
  loading: "eager" as const,
};

// Example 4: Gallery thumbnail
const galleryImageBlok = {
  image_url: {
    filename:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=400&q=80",
  },
  alt: "Nature photography",
  aspectRatio: "square" as const,
  objectFit: "cover" as const,
  rounded: "xl" as const,
  shadow: "2xl" as const,
  hoverEffect: "opacity" as const,
  containerBackground: "gray-100",
};

// Example 5: Legacy compatibility (existing fields still work)
const legacyImageBlok = {
  image_url: {
    filename:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  },
  alt: "Legacy image example",
  width: "400px",
  height: "300px",
  borderRadius: "12px", // Legacy field still supported
};

export const ImageExamples: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Image Component Examples</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Responsive Image</h2>
        <div className="max-w-md">
          <ImageComponent blok={basicImageBlok} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Avatar with Hover Effect</h2>
        <ImageComponent blok={avatarImageBlok} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Hero Image with Overlay</h2>
        <div className="max-w-4xl">
          <ImageComponent blok={heroImageBlok} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Gallery Grid</h2>
        <div className="grid grid-cols-3 gap-4 max-w-md">
          <ImageComponent blok={galleryImageBlok} />
          <ImageComponent
            blok={{
              ...galleryImageBlok,
              image_url: {
                filename:
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
              },
            }}
          />
          <ImageComponent
            blok={{
              ...galleryImageBlok,
              image_url: {
                filename:
                  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80",
              },
            }}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Legacy Compatibility</h2>
        <ImageComponent blok={legacyImageBlok} />
      </section>
    </div>
  );
};

export default ImageExamples;

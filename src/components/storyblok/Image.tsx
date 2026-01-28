import React from "react";
import type { ImageBlok } from "./types/ImageTypes";

const ImageComponent: React.FC<{ blok: ImageBlok }> = ({ blok }) => {
  // Base classes following Preline UI patterns
  const getObjectFitClass = () => {
    switch (blok.objectFit) {
      case "cover":
        return "object-cover";
      case "contain":
        return "object-contain";
      case "fill":
        return "object-fill";
      case "scale-down":
        return "object-scale-down";
      case "none":
        return "object-none";
      default:
        return "object-cover"; // Default to cover for responsive images
    }
  };

  const getAspectRatioClass = () => {
    switch (blok.aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "photo":
        return "aspect-[4/3]";
      case "auto":
        return "";
      default:
        return "";
    }
  };

  const getShadowClass = () => {
    switch (blok.shadow) {
      case "none":
        return "";
      case "sm":
        return "shadow-sm";
      case "md":
        return "shadow-md";
      case "lg":
        return "shadow-lg";
      case "xl":
        return "shadow-xl";
      case "2xl":
        return "shadow-2xl";
      default:
        return "";
    }
  };

  const getRoundedClass = () => {
    // Use new rounded prop or fallback to legacy borderRadius
    const roundedValue = blok.rounded || blok.borderRadius;
    switch (roundedValue) {
      case "none":
        return "rounded-none";
      case "sm":
        return "rounded-sm";
      case "md":
        return "rounded-md";
      case "lg":
        return "rounded-lg";
      case "xl":
        return "rounded-xl";
      case "2xl":
        return "rounded-2xl";
      case "full":
        return "rounded-full";
      default:
        return roundedValue ? `rounded-[${roundedValue}]` : "";
    }
  };

  const getHoverEffectClass = () => {
    switch (blok.hoverEffect) {
      case "zoom":
        return "hover:scale-105 transition-transform duration-300 ease-in-out";
      case "opacity":
        return "hover:opacity-80 transition-opacity duration-300 ease-in-out";
      case "scale":
        return "hover:scale-110 transition-transform duration-300 ease-in-out";
      case "none":
        return "";
      default:
        return "";
    }
  };

  const getDisplayClass = () => {
    return blok.displayMode === "inline" ? "inline" : "block";
  };

  // Build comprehensive class list following Preline UI patterns
  const imageClasses = [
    // Display mode (Preline default is block)
    getDisplayClass(),
    // Max width constraint (only use class if not dynamic)
    !blok.maxWidth && "max-w-full",
    // Aspect ratio
    getAspectRatioClass(),
    // Object fit for responsive behavior
    getObjectFitClass(),
    // Visual effects
    getRoundedClass(),
    getShadowClass(),
    getHoverEffectClass(),
    // Responsive behavior - only add h-auto if no explicit height is set
    !blok.height && !blok.boxsize_base && "h-auto",
  ]
    .filter(Boolean)
    .join(" ");

  // Use inline styles for dynamic dimension values
  const imageStyle: React.CSSProperties = {
    ...(blok.boxsize_base && { width: blok.boxsize_base, height: blok.boxsize_base }),
    ...(blok.width && { width: blok.width }),
    ...(blok.height && { height: blok.height }),
    ...(blok.maxWidth && { maxWidth: blok.maxWidth }),
  };

  const containerClasses = [
    "relative",
    "overflow-hidden",
    blok.containerBackground && `bg-${blok.containerBackground}`,
    getRoundedClass(), // Apply same rounding to container
  ]
    .filter(Boolean)
    .join(" ");

  const overlayClasses = blok.overlay
    ? [
        "absolute",
        "inset-0",
        "bg-black",
        blok.overlayOpacity ? `bg-opacity-${blok.overlayOpacity}` : "bg-opacity-30",
        blok.overlayColor && `bg-${blok.overlayColor}`,
        "transition-opacity",
        "duration-300",
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  // If we need a container (for overlay or background), wrap the image
  if (blok.overlay || blok.containerBackground) {
    return (
      <div className={containerClasses}>
        <img
          src={blok.image_url.filename}
          alt={blok.alt || ""}
          className={imageClasses}
          style={imageStyle}
          loading={blok.loading || "lazy"}
        />
        {blok.overlay && <div className={overlayClasses} />}
      </div>
    );
  }

  // Simple image without container
  return (
    <img
      src={blok.image_url.filename}
      alt={blok.alt || ""}
      className={imageClasses}
      style={imageStyle}
      loading={blok.loading || "lazy"}
    />
  );
};

export default ImageComponent;

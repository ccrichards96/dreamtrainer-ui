import React from "react";
import { storyblokEditable, SbBlokData } from "@storyblok/react";

interface SpacerBlok extends SbBlokData {
  // Height options
  height?: string;
  // Width options (for horizontal spacers)
  width?: string;
  // Responsive height options
  sm_height?: string;
  md_height?: string;
  lg_height?: string;
  xl_height?: string;
  // Responsive width options
  sm_width?: string;
  md_width?: string;
  lg_width?: string;
  xl_width?: string;
  // Display options
  display?: "block" | "inline-block";
  // Background color (for visual debugging)
  background_color?: string;
}

const Spacer: React.FC<{ blok: SpacerBlok }> = ({ blok }) => {
  const baseClasses = [];
  const customStyles: React.CSSProperties & { [key: string]: string } = {};

  // Display type
  if (blok.display === "inline-block") {
    baseClasses.push("inline-block");
  } else {
    baseClasses.push("block");
  }

  // Handle height
  if (blok.height) {
    if (
      blok.height.includes("px") ||
      blok.height.includes("rem") ||
      blok.height.includes("vh") ||
      blok.height.includes("%") ||
      blok.height.includes("em")
    ) {
      customStyles.height = blok.height;
    } else {
      // Assume it's a Tailwind class value
      baseClasses.push(`h-${blok.height}`);
    }
  }

  // Handle width
  if (blok.width) {
    if (
      blok.width.includes("px") ||
      blok.width.includes("rem") ||
      blok.width.includes("vw") ||
      blok.width.includes("%") ||
      blok.width.includes("em")
    ) {
      customStyles.width = blok.width;
    } else {
      // Assume it's a Tailwind class value
      baseClasses.push(`w-${blok.width}`);
    }
  }

  // Handle responsive heights
  if (blok.sm_height) {
    if (
      blok.sm_height.includes("px") ||
      blok.sm_height.includes("rem") ||
      blok.sm_height.includes("vh") ||
      blok.sm_height.includes("%") ||
      blok.sm_height.includes("em")
    ) {
      // For custom values, we'll need to use CSS custom properties
      customStyles["--sm-height"] = blok.sm_height;
      baseClasses.push("sm:[height:var(--sm-height)]");
    } else {
      baseClasses.push(`sm:h-${blok.sm_height}`);
    }
  }

  if (blok.md_height) {
    if (
      blok.md_height.includes("px") ||
      blok.md_height.includes("rem") ||
      blok.md_height.includes("vh") ||
      blok.md_height.includes("%") ||
      blok.md_height.includes("em")
    ) {
      customStyles["--md-height"] = blok.md_height;
      baseClasses.push("md:[height:var(--md-height)]");
    } else {
      baseClasses.push(`md:h-${blok.md_height}`);
    }
  }

  if (blok.lg_height) {
    if (
      blok.lg_height.includes("px") ||
      blok.lg_height.includes("rem") ||
      blok.lg_height.includes("vh") ||
      blok.lg_height.includes("%") ||
      blok.lg_height.includes("em")
    ) {
      customStyles["--lg-height"] = blok.lg_height;
      baseClasses.push("lg:[height:var(--lg-height)]");
    } else {
      baseClasses.push(`lg:h-${blok.lg_height}`);
    }
  }

  if (blok.xl_height) {
    if (
      blok.xl_height.includes("px") ||
      blok.xl_height.includes("rem") ||
      blok.xl_height.includes("vh") ||
      blok.xl_height.includes("%") ||
      blok.xl_height.includes("em")
    ) {
      customStyles["--xl-height"] = blok.xl_height;
      baseClasses.push("xl:[height:var(--xl-height)]");
    } else {
      baseClasses.push(`xl:h-${blok.xl_height}`);
    }
  }

  // Handle responsive widths
  if (blok.sm_width) {
    if (
      blok.sm_width.includes("px") ||
      blok.sm_width.includes("rem") ||
      blok.sm_width.includes("vw") ||
      blok.sm_width.includes("%") ||
      blok.sm_width.includes("em")
    ) {
      customStyles["--sm-width"] = blok.sm_width;
      baseClasses.push("sm:[width:var(--sm-width)]");
    } else {
      baseClasses.push(`sm:w-${blok.sm_width}`);
    }
  }

  if (blok.md_width) {
    if (
      blok.md_width.includes("px") ||
      blok.md_width.includes("rem") ||
      blok.md_width.includes("vw") ||
      blok.md_width.includes("%") ||
      blok.md_width.includes("em")
    ) {
      customStyles["--md-width"] = blok.md_width;
      baseClasses.push("md:[width:var(--md-width)]");
    } else {
      baseClasses.push(`md:w-${blok.md_width}`);
    }
  }

  if (blok.lg_width) {
    if (
      blok.lg_width.includes("px") ||
      blok.lg_width.includes("rem") ||
      blok.lg_width.includes("vw") ||
      blok.lg_width.includes("%") ||
      blok.lg_width.includes("em")
    ) {
      customStyles["--lg-width"] = blok.lg_width;
      baseClasses.push("lg:[width:var(--lg-width)]");
    } else {
      baseClasses.push(`lg:w-${blok.lg_width}`);
    }
  }

  if (blok.xl_width) {
    if (
      blok.xl_width.includes("px") ||
      blok.xl_width.includes("rem") ||
      blok.xl_width.includes("vw") ||
      blok.xl_width.includes("%") ||
      blok.xl_width.includes("em")
    ) {
      customStyles["--xl-width"] = blok.xl_width;
      baseClasses.push("xl:[width:var(--xl-width)]");
    } else {
      baseClasses.push(`xl:w-${blok.xl_width}`);
    }
  }

  // Handle background color (for visual debugging)
  if (blok.background_color) {
    if (
      blok.background_color.startsWith("#") ||
      blok.background_color.startsWith("rgb") ||
      blok.background_color.startsWith("hsl")
    ) {
      customStyles.backgroundColor = blok.background_color;
    } else {
      baseClasses.push(`bg-${blok.background_color}`);
    }
  }

  const classes = baseClasses.filter(Boolean).join(" ");

  return (
    <div
      {...storyblokEditable(blok)}
      className={classes}
      style={customStyles}
    />
  );
};

export default Spacer;

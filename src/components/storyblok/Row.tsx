import React from "react";
import { storyblokEditable, SbBlokData, StoryblokComponent } from "@storyblok/react";

interface RowBlok extends SbBlokData {
  columns: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;
  gap?: string;
  display?: string;
  justifyContent?: string;
  alignItems?: string;
  flexDirection?: string;
  flexWrap?: string;
  padding?: string;
  margin?: string;
}

const Row: React.FC<{ blok: RowBlok }> = ({ blok }) => {
  const baseClasses = ["flex"];
  const customStyles: React.CSSProperties = {};

  // Handle gap - support both CSS values and Tailwind classes
  if (blok.gap) {
    if (
      blok.gap.includes("px") ||
      blok.gap.includes("rem") ||
      blok.gap.includes("em") ||
      blok.gap.includes("%")
    ) {
      customStyles.gap = blok.gap;
    } else {
      baseClasses.push(`gap-${blok.gap}`);
    }
  }

  // Handle other properties
  if (blok.display) {
    baseClasses.push(blok.display);
  }

  if (blok.justifyContent) {
    baseClasses.push(`justify-${blok.justifyContent}`);
  }

  if (blok.alignItems) {
    baseClasses.push(`items-${blok.alignItems}`);
  }

  if (blok.flexDirection) {
    baseClasses.push(`flex-${blok.flexDirection}`);
  }

  if (blok.flexWrap) {
    baseClasses.push(`flex-${blok.flexWrap}`);
  }

  // Handle padding - support both CSS values and Tailwind classes
  if (blok.padding) {
    if (
      blok.padding.includes("px") ||
      blok.padding.includes("rem") ||
      blok.padding.includes("em") ||
      blok.padding.includes("%")
    ) {
      customStyles.padding = blok.padding;
    } else {
      baseClasses.push(`p-${blok.padding}`);
    }
  }

  // Handle margin - support both CSS values and Tailwind classes
  if (blok.margin) {
    if (
      blok.margin.includes("px") ||
      blok.margin.includes("rem") ||
      blok.margin.includes("em") ||
      blok.margin.includes("%")
    ) {
      customStyles.margin = blok.margin;
    } else {
      baseClasses.push(`m-${blok.margin}`);
    }
  }

  const classes = baseClasses.filter(Boolean).join(" ");

  return (
    <div {...storyblokEditable(blok)} className={classes} style={customStyles}>
      {blok.columns?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};

export default Row;

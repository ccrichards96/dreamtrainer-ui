import React from "react";
import {
  storyblokEditable,
  SbBlokData,
  StoryblokComponent,
} from "@storyblok/react";

interface GridBlok extends SbBlokData {
  columns: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;
  cols?:
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12";
  rows?: "1" | "2" | "3" | "4" | "5" | "6";
  gap?:
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "8"
    | "10"
    | "12"
    | "16"
    | "20"
    | "24";
  gapX?:
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "8"
    | "10"
    | "12"
    | "16"
    | "20"
    | "24";
  gapY?:
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "8"
    | "10"
    | "12"
    | "16"
    | "20"
    | "24";
  flow?: "row" | "col" | "row-dense" | "col-dense";
  padding?:
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "8"
    | "10"
    | "12"
    | "16"
    | "20"
    | "24";
  margin?:
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "8"
    | "10"
    | "12"
    | "16"
    | "20"
    | "24";
}

const defaultGridStyles = {
  cols: "2", // Default to two columns
  gap: "4", // Default gap-4 (1rem)
  flow: "row", // Default flow direction
  padding: "0",
  margin: "0",
};

const Grid: React.FC<{ blok: GridBlok }> = ({ blok }) => {
  // Build class names using Preline UI patterns
  const gridClasses = [
    "grid", // Base grid class

    // Grid template columns - use standard Tailwind grid-cols-n pattern
    blok.cols
      ? `grid-cols-${blok.cols}`
      : `grid-cols-${defaultGridStyles.cols}`,

    // Grid template rows if specified
    blok.rows && `grid-rows-${blok.rows}`,

    // Gap handling - prefer individual gap-x and gap-y over general gap
    blok.gapX && blok.gapY
      ? `gap-x-${blok.gapX} gap-y-${blok.gapY}`
      : blok.gap
        ? `gap-${blok.gap}`
        : `gap-${defaultGridStyles.gap}`,

    // Grid flow direction
    blok.flow && blok.flow !== "row" ? `grid-flow-${blok.flow}` : undefined,

    // Spacing
    blok.padding && blok.padding !== "0" ? `p-${blok.padding}` : undefined,
    blok.margin && blok.margin !== "0" ? `m-${blok.margin}` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...storyblokEditable(blok)} className={gridClasses}>
      {blok.columns?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};

export default Grid;

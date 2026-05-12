import React from "react";
import { storyblokEditable, SbBlokData, StoryblokComponent } from "@storyblok/react";

interface GridBlok extends SbBlokData {
  columns: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;
  cols?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
  rows?: "1" | "2" | "3" | "4" | "5" | "6";
  gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16" | "20" | "24";
  gapX?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16" | "20" | "24";
  gapY?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16" | "20" | "24";
  flow?: "row" | "col" | "row-dense" | "col-dense";
  padding?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16" | "20" | "24";
  margin?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16" | "20" | "24";
}

// Static map so Tailwind JIT can detect every class string at build time.
// Mobile-first: always single column, stepping up at sm/lg breakpoints.
const responsiveColsMap: Record<string, string> = {
  "1":  "grid-cols-1",
  "2":  "grid-cols-1 sm:grid-cols-2",
  "3":  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "4":  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  "5":  "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  "6":  "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  "7":  "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7",
  "8":  "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8",
  "9":  "grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9",
  "10": "grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-10",
  "11": "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-11",
  "12": "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12",
};

const defaultGridStyles = {
  cols: "2",
  gap: "4",
  flow: "row",
  padding: "0",
  margin: "0",
};

const Grid: React.FC<{ blok: GridBlok }> = ({ blok }) => {
  const colsKey = blok.cols ?? defaultGridStyles.cols;

  const gridClasses = [
    "grid",

    responsiveColsMap[colsKey] ?? responsiveColsMap["2"],

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

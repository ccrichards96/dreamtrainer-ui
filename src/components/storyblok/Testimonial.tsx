import React from "react";
import { storyblokEditable, SbBlokData } from "@storyblok/react";
import { Quote } from "lucide-react";

interface TestimonialBlok extends SbBlokData {
  // Person details
  name: string;
  country?: string;
  // Testimonial content
  testimonial: string;
  // Layout options
  card_style?: "default" | "minimal" | "elevated";
  text_align?: "left" | "center" | "right";
  // Custom styling
  background_color?: string;
  text_color?: string;
  border_color?: string;
  custom_classes?: string;
}

const Testimonial: React.FC<{ blok: TestimonialBlok }> = ({ blok }) => {
  // Base classes
  const baseClasses = ["group", "transition-all", "duration-300"];
  const customStyles: React.CSSProperties = {};

  // Card style variations
  switch (blok.card_style || "default") {
    case "minimal":
      baseClasses.push("p-6", "rounded-lg");
      break;
    case "elevated":
      baseClasses.push(
        "p-8",
        "rounded-2xl",
        "shadow-lg",
        "hover:shadow-xl",
        "transform",
        "hover:-translate-y-2"
      );
      break;
    default:
      baseClasses.push(
        "p-8",
        "rounded-2xl",
        "shadow-lg",
        "hover:shadow-xl",
        "border",
        "border-gray-100"
      );
      break;
  }

  // Background styling
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
  } else {
    baseClasses.push("bg-white");
  }

  // Text alignment
  const textAlign = blok.text_align || "left";
  baseClasses.push(`text-${textAlign}`);

  // Text color
  if (blok.text_color) {
    if (
      blok.text_color.startsWith("#") ||
      blok.text_color.startsWith("rgb") ||
      blok.text_color.startsWith("hsl")
    ) {
      customStyles.color = blok.text_color;
    } else {
      baseClasses.push(`text-${blok.text_color}`);
    }
  }

  // Border color
  if (blok.border_color) {
    if (
      blok.border_color.startsWith("#") ||
      blok.border_color.startsWith("rgb") ||
      blok.border_color.startsWith("hsl")
    ) {
      customStyles.borderColor = blok.border_color;
    } else {
      baseClasses.push(`border-${blok.border_color}`);
    }
  }

  // Custom classes
  if (blok.custom_classes) {
    baseClasses.push(blok.custom_classes);
  }

  const classes = baseClasses.filter(Boolean).join(" ");

  return (
    <div {...storyblokEditable(blok)} className={classes} style={customStyles}>
      {/* Testimonial content first */}
      <p className="text-gray-700 leading-relaxed mb-6">{blok.testimonial}</p>

      {/* Person info with quote icon underneath */}
      <div
        className={`flex items-center ${textAlign === "center" ? "justify-center" : textAlign === "right" ? "justify-end" : "justify-start"}`}
      >
        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
          <Quote className="h-6 w-6 text-blue-600" />
        </div>
        <div
          className={
            textAlign === "center"
              ? "text-center"
              : textAlign === "right"
                ? "text-right"
                : "text-left"
          }
        >
          <h4 className="font-semibold text-gray-900">{blok.name}</h4>
          {blok.country && (
            <div className="text-gray-600 text-sm">
              <span>{blok.country}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;

import React from "react";
import {
  storyblokEditable,
  SbBlokData,
  StoryblokComponent,
} from "@storyblok/react";

interface HeroBlok extends SbBlokData {
  content: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;
  // Hero-specific fields
  subtitle?: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonIcon?: string;
  // Layout customization
  backgroundColor?: string;
  backgroundImage?: string;
  minHeight?: string;
  maxHeight?: string;
  display?: string;
  justifyContent?: string;
  alignItems?: string;
  padding?: string;
  margin?: string;
  // Gradient options
  showGradients?: boolean;
  gradientColor1?: string;
  gradientColor2?: string;
}

const Hero: React.FC<{ blok: HeroBlok }> = ({ blok }) => {
  const containerClasses = [
    "relative overflow-hidden",
    blok.backgroundColor && `bg-[${blok.backgroundColor}]`,
    blok.minHeight && `min-h-[${blok.minHeight}]`,
    blok.maxHeight && `max-h-[${blok.maxHeight}]`,
    blok.display && `${blok.display}`,
    blok.justifyContent && `justify-${blok.justifyContent}`,
    blok.alignItems && `items-${blok.alignItems}`,
    blok.padding && `p-[${blok.padding}]`,
    blok.margin && `m-[${blok.margin}]`,
  ]
    .filter(Boolean)
    .join(" ");

  const style = blok.backgroundImage
    ? {
        backgroundImage: `url(${blok.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <div
      {...storyblokEditable(blok)}
      className={containerClasses}
      style={style}
    >
      {/* Gradients - only show if enabled */}
      {blok.showGradients !== false && (
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
        >
          <div
            className={`bg-gradient-to-r ${blok.gradientColor1 ? `from-[${blok.gradientColor1}]` : "from-violet-300/50"} ${blok.gradientColor2 ? `to-[${blok.gradientColor2}]` : "to-purple-100"} blur-3xl w-[400px] h-[700px] rotate-[-60deg] transform -translate-x-40 dark:from-violet-900/50 dark:to-purple-900`}
          ></div>
          <div className="bg-gradient-to-tl from-blue-50 via-blue-100 to-blue-50 blur-3xl w-[1440px] h-[800px] rounded-full origin-top-left -rotate-12 -translate-x-60 dark:from-indigo-900/70 dark:via-indigo-900/70 dark:to-blue-900/70"></div>
        </div>
      )}

      <div className="relative z-10">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-2xl text-center mx-auto">
            {/* Subtitle */}
            {blok.subtitle && (
              <p className="inline-block text-sm font-medium bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400">
                {blok.subtitle}
              </p>
            )}

            {/* Title */}
            {blok.title && (
              <div className="mt-5 max-w-2xl">
                <h1 className="block font-semibold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-neutral-200">
                  {blok.title}
                </h1>
              </div>
            )}

            {/* Description */}
            {blok.description && (
              <div className="mt-5 max-w-3xl">
                <p className="text-lg text-gray-600 dark:text-neutral-400">
                  {blok.description}
                </p>
              </div>
            )}

            {/* Buttons */}
            {(blok.primaryButtonText || blok.secondaryButtonText) && (
              <div className="mt-8 gap-3 flex justify-center">
                {/* Primary Button */}
                {blok.primaryButtonText && (
                  <a
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    href={blok.primaryButtonLink || "#"}
                  >
                    {blok.primaryButtonText}
                    <svg
                      className="shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </a>
                )}

                {/* Secondary Button */}
                {blok.secondaryButtonText && (
                  <a
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                    href={blok.secondaryButtonLink || "#"}
                  >
                    {blok.secondaryButtonIcon && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: blok.secondaryButtonIcon,
                        }}
                      />
                    )}
                    {blok.secondaryButtonText}
                  </a>
                )}
              </div>
            )}

            {/* Nested Storyblok Components */}
            {blok.content?.map((nestedBlok) => (
              <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

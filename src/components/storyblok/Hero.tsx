import React from "react";
import { storyblokEditable, SbBlokData, StoryblokComponent } from "@storyblok/react";

interface HeroBlok extends SbBlokData {
  content: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;
  // Hero-specific fields
  subtitle?: string;
  subtitleColor?: ColorValue;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string | { url: string };
  secondaryButtonText?: string;
  secondaryButtonLink?: string | { url: string };
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
  hideGradient?: boolean;
  /** @deprecated use hideGradient — still honoured when explicitly false */
  showGradients?: boolean;
  // Accent streak (small rotated band)
  gradientColor1?: ColorValue;
  gradientColor2?: ColorValue;
  // Glow (large blurred shape behind the streak)
  gradientGlowColor1?: ColorValue;
  gradientGlowColor2?: ColorValue;
  gradientOpacity?: string | number;
}

// Plain string (hex/rgb/hsl/css name) or Storyblok native-color-picker value
type ColorValue = string | { color?: string };

const resolveColor = (value: ColorValue | undefined): string | undefined => {
  const color = typeof value === "string" ? value : value?.color;
  return color?.trim() || undefined;
};

const Hero: React.FC<{ blok: HeroBlok }> = ({ blok }) => {
  const showGradient = !blok.hideGradient && blok.showGradients !== false;
  const subtitleColor = resolveColor(blok.subtitleColor);

  const streakFrom = resolveColor(blok.gradientColor1) || "rgba(196, 181, 253, 0.5)";
  const streakTo = resolveColor(blok.gradientColor2) || "#f3e8ff";

  const glowEdge = resolveColor(blok.gradientGlowColor1);
  const glowCenter = resolveColor(blok.gradientGlowColor2);
  const hasCustomGlow = Boolean(glowEdge || glowCenter);
  const glowStyle: React.CSSProperties | undefined = hasCustomGlow
    ? {
        background: `linear-gradient(to top left, ${glowEdge || glowCenter}, ${glowCenter || glowEdge}, ${glowEdge || glowCenter})`,
      }
    : undefined;

  const parsedOpacity = Number(blok.gradientOpacity);
  const gradientOpacity =
    blok.gradientOpacity !== undefined && blok.gradientOpacity !== "" && !isNaN(parsedOpacity)
      ? Math.min(Math.max(parsedOpacity, 0), 100) / 100
      : undefined;

  console.log("Hero blok:", blok);
  const containerClasses = [
    "relative overflow-hidden",
    blok.display && `${blok.display}`,
    blok.justifyContent && `justify-${blok.justifyContent}`,
    blok.alignItems && `items-${blok.alignItems}`,
  ]
    .filter(Boolean)
    .join(" ");

  const style: React.CSSProperties = {
    ...(blok.backgroundColor && { backgroundColor: blok.backgroundColor }),
    ...(blok.minHeight && { minHeight: blok.minHeight }),
    ...(blok.maxHeight && { maxHeight: blok.maxHeight }),
    ...(blok.padding && { padding: blok.padding }),
    ...(blok.margin && { margin: blok.margin }),
    ...(blok.backgroundImage && {
      backgroundImage: `url(${blok.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }),
  };

  return (
    <div {...storyblokEditable(blok)} className={containerClasses} style={style}>
      {/* Gradients - only show if enabled */}
      {showGradient && (
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2 pointer-events-none"
          style={gradientOpacity !== undefined ? { opacity: gradientOpacity } : undefined}
        >
          <div
            className="blur-3xl w-[400px] h-[700px] rotate-[-60deg] transform -translate-x-40"
            style={{ background: `linear-gradient(to right, ${streakFrom}, ${streakTo})` }}
          ></div>
          <div
            className={`blur-3xl w-[1440px] h-[800px] rounded-full origin-top-left -rotate-12 -translate-x-60 ${
              hasCustomGlow
                ? ""
                : "bg-gradient-to-tl from-blue-50 via-blue-100 to-blue-50 dark:from-indigo-900/70 dark:via-indigo-900/70 dark:to-blue-900/70"
            }`}
            style={glowStyle}
          ></div>
        </div>
      )}

      <div className="relative z-10">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16">
          <div className="max-w-2xl text-center mx-auto">
            {/* Subtitle */}
            {blok.subtitle && (
              <p
                className={`inline-block text-md font-medium ${
                  subtitleColor
                    ? ""
                    : "bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400"
                }`}
                style={subtitleColor ? { color: subtitleColor } : undefined}
              >
                {blok.subtitle}
              </p>
            )}

            {/* Title */}
            {blok.title && (
              <div className="mt-5 max-w-2xl">
                <h1 className="block font-semibold text-gray-100 text-4xl md:text-5xl lg:text-6xl dark:text-neutral-100">
                  {blok.title}
                </h1>
              </div>
            )}

            {/* Description */}
            {blok.description && (
              <div className="mt-5 max-w-3xl">
                <p className="text-lg text-white dark:text-neutral-100">{blok.description}</p>
              </div>
            )}

            {/* Buttons */}
            {(blok.primaryButtonText || blok.secondaryButtonText) && (
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* Primary Button */}
                {blok.primaryButtonText && (
                  <a
                    className="w-full sm:w-auto justify-center py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
                    href={
                      typeof blok.primaryButtonLink === "string"
                        ? blok.primaryButtonLink
                        : blok.primaryButtonLink?.url || "#"
                    }
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
                    className="w-full sm:w-auto justify-center py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                    href={
                      typeof blok.secondaryButtonLink === "string"
                        ? blok.secondaryButtonLink
                        : blok.secondaryButtonLink?.url || "#"
                    }
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

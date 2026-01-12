import React from "react";
import { storyblokEditable, SbBlokData, StoryblokComponent } from "@storyblok/react";

interface FeatureItem {
  _uid: string;
  component: string;
  icon?: string;
  title?: string;
  description?: string;
  iconBackgroundColor?: string;
  iconBorderColor?: string;
  iconColor?: string;
}

interface FeaturesBlok extends SbBlokData {
  content: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;
  // Features-specific fields
  features?: FeatureItem[];
  // Layout customization
  maxWidth?: string;
  columns?: string;
  gap?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  // Grid customization
  smColumns?: string;
  lgColumns?: string;
  alignment?: string;
}

const Features: React.FC<{ blok: FeaturesBlok }> = ({ blok }) => {
  // Default values
  const maxWidth = blok.maxWidth || "max-w-[85rem]";
  const columns = blok.columns || "grid-cols-1";
  const smColumns = blok.smColumns || "sm:grid-cols-2";
  const lgColumns = blok.lgColumns || "lg:grid-cols-4";
  const gap = blok.gap || "gap-12";
  const alignment = blok.alignment || "items-center";
  const padding = blok.padding || "px-4 py-10 sm:px-6 lg:px-8 lg:py-14";

  const containerClasses = [
    maxWidth,
    padding,
    "mx-auto",
    blok.backgroundColor && `bg-[${blok.backgroundColor}]`,
    blok.margin && `m-[${blok.margin}]`,
  ]
    .filter(Boolean)
    .join(" ");

  const gridClasses = ["grid", columns, smColumns, lgColumns, alignment, gap]
    .filter(Boolean)
    .join(" ");

  // Default features if none provided
  const defaultFeatures: FeatureItem[] = [
    {
      _uid: "1",
      component: "feature_item",
      icon: '<svg class="shrink-0 size-5 text-gray-600 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="10" height="14" x="3" y="8" rx="2"/><path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4"/><path d="M8 18h.01"/></svg>',
      title: "Responsive",
      description: "Responsive, and mobile-first project on the web",
    },
    {
      _uid: "2",
      component: "feature_item",
      icon: '<svg class="shrink-0 size-5 text-gray-600 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>',
      title: "Customizable",
      description: "Components are easily customized and extendable",
    },
    {
      _uid: "3",
      component: "feature_item",
      icon: '<svg class="shrink-0 size-5 text-gray-600 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
      title: "Documentation",
      description: "Every component and plugin is well documented",
    },
    {
      _uid: "4",
      component: "feature_item",
      icon: '<svg class="shrink-0 size-5 text-gray-600 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>',
      title: "24/7 Support",
      description: "Contact us 24 hours a day, 7 days a week",
    },
  ];

  const features = blok.features && blok.features.length > 0 ? blok.features : defaultFeatures;

  const FeatureItem: React.FC<{ feature: FeatureItem }> = ({ feature }) => {
    const iconBgColor = feature.iconBackgroundColor || "bg-gray-50 dark:bg-neutral-800";
    const iconBorderColor = feature.iconBorderColor || "border-gray-200 dark:border-neutral-700";
    const iconColor = feature.iconColor || "text-gray-600 dark:text-neutral-400";

    return (
      <div className="text-center">
        {/* Icon Container */}
        <div
          className={`flex justify-center items-center size-12 ${iconBgColor} border ${iconBorderColor} rounded-full mx-auto`}
        >
          {feature.icon ? (
            <div className={iconColor} dangerouslySetInnerHTML={{ __html: feature.icon }} />
          ) : (
            // Default icon if none provided
            <svg
              className="shrink-0 size-5 text-gray-600 dark:text-neutral-400"
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
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6" />
              <path d="m1 12 6 0m6 0 6 0" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="mt-3">
          {feature.title && (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{feature.title}</h3>
          )}
          {feature.description && (
            <p className="mt-1 text-gray-600 dark:text-neutral-400">{feature.description}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div {...storyblokEditable(blok)} className={containerClasses}>
      <div className={gridClasses}>
        {/* Render features */}
        {features.map((feature) => (
          <FeatureItem key={feature._uid} feature={feature} />
        ))}
      </div>

      {/* Nested Storyblok Components */}
      {blok.content?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};

export default Features;

import { Search } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  /** Optional background photo, shown under a dark overlay. */
  backgroundImage?: string;
  /** When provided, renders the pill search bar under the subtitle. */
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  className?: string;
  /** Extra content under the search bar (e.g. filter pills). */
  children?: React.ReactNode;
}

/** Dark gradient hero shared by the Explore pages (courses, offers). */
export default function PageHero({
  title,
  subtitle,
  eyebrow = "Dream Trainer",
  backgroundImage,
  search,
  className = "",
  children,
}: PageHeroProps) {
  return (
    <div
      className={`relative overflow-hidden bg-[#1e1630] ${className}`}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Dark overlay (only when background image is set) */}
      {backgroundImage && <div className="absolute inset-0 bg-black/55" />}

      {/* Preline-style gradient blobs */}
      <div
        aria-hidden="true"
        className="flex absolute -top-96 start-1/2 -translate-x-1/2 pointer-events-none"
      >
        <div className="bg-gradient-to-r from-violet-500/40 to-purple-300/30 blur-3xl w-[400px] h-[700px] rotate-[-60deg] -translate-x-40" />
        <div className="bg-gradient-to-tl from-indigo-900/60 via-purple-900/40 to-violet-800/30 blur-3xl w-[1440px] h-[800px] rounded-full origin-top-left -rotate-12 -translate-x-60" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="inline-block text-sm font-medium bg-clip-text bg-gradient-to-l from-blue-400 to-violet-400 text-transparent">
            {eyebrow}
          </p>
          <h1 className="mt-3 block font-semibold text-white text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && <p className="mt-4 text-lg text-white/70">{subtitle}</p>}

          {search && (
            <div className="mt-8 relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                aria-label={search.placeholder ?? "Search"}
                placeholder={search.placeholder}
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-transparent rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}

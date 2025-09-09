import React from "react";
import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { render } from "storyblok-rich-text-react-renderer";
import { motion } from "framer-motion";
import type { PostBlok, AuthorBlok } from "./types/PostTypes";

// Enhanced Author Component with Preline UI patterns
const BlogAuthor: React.FC<{
  author?: AuthorBlok;
  date?: string;
  readTime?: string;
  showTooltip?: boolean;
}> = ({ author, date, readTime, showTooltip = true }) => {
  if (!author?.name) return null;

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex w-full sm:items-center gap-x-5 sm:gap-x-3">
        <div className="shrink-0">
          <img
            className="size-12 rounded-full object-cover"
            src={author.image?.filename}
            alt={`Avatar of ${author.name}`}
          />
        </div>

        <div className="grow">
          <div className="flex justify-between items-center gap-x-2">
            <div>
              {showTooltip ? (
                <div className="hs-tooltip [--trigger:hover] [--placement:bottom] inline-block">
                  <div className="hs-tooltip-toggle sm:mb-1 block text-start cursor-pointer">
                    <span className="font-semibold text-gray-800 dark:text-neutral-200">
                      {author.name}
                    </span>

                    {/* Author Tooltip */}
                    <div
                      className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 max-w-xs cursor-default bg-gray-900 divide-y divide-gray-700 shadow-lg rounded-xl dark:bg-neutral-950 dark:divide-neutral-700"
                      role="tooltip"
                    >
                      <div className="p-4 sm:p-5">
                        <div className="mb-2 flex w-full sm:items-center gap-x-5 sm:gap-x-3">
                          <div className="shrink-0">
                            <img
                              className="size-8 rounded-full object-cover"
                              src={author.image?.filename}
                              alt={`Avatar of ${author.name}`}
                            />
                          </div>
                          <div className="grow">
                            <p className="text-lg font-semibold text-gray-200 dark:text-neutral-200">
                              {author.name}
                            </p>
                          </div>
                        </div>
                        {author.bio && (
                          <p className="text-sm text-gray-400 dark:text-neutral-400">
                            {author.bio}
                          </p>
                        )}
                      </div>

                      {(author.articles_count || author.followers_count) && (
                        <div className="flex justify-between items-center px-4 py-3 sm:px-5">
                          <ul className="text-xs space-x-3">
                            {author.articles_count && (
                              <li className="inline-block">
                                <span className="font-semibold text-gray-200 dark:text-neutral-200">
                                  {author.articles_count}
                                </span>
                                <span className="text-gray-400 dark:text-neutral-400">
                                  {" "}
                                  articles
                                </span>
                              </li>
                            )}
                            {author.followers_count && (
                              <li className="inline-block">
                                <span className="font-semibold text-gray-200 dark:text-neutral-200">
                                  {author.followers_count}
                                </span>
                                <span className="text-gray-400 dark:text-neutral-400">
                                  {" "}
                                  followers
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <span className="font-semibold text-gray-800 dark:text-neutral-200">
                  {author.name}
                </span>
              )}

              <ul className="text-xs text-gray-500 dark:text-neutral-500">
                {date && (
                  <li className="inline-block relative pe-6 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:size-1 before:bg-gray-300 before:rounded-full dark:text-neutral-400 dark:before:bg-neutral-600">
                    {date}
                  </li>
                )}
                {readTime && (
                  <li className="inline-block relative pe-6 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:size-1 before:bg-gray-300 before:rounded-full dark:text-neutral-400 dark:before:bg-neutral-600">
                    {readTime} min read
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Social Share Component
const SocialShareButton: React.FC<{
  platform: string;
  onClick?: () => void;
}> = ({ platform, onClick }) => {
  const getSocialIcon = () => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return (
          <svg
            className="size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
          </svg>
        );
      default:
        return (
          <svg
            className="size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" x2="12" y1="2" y2="15" />
          </svg>
        );
    }
  };

  return (
    <button
      type="button"
      className="py-1.5 px-2.5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
      onClick={onClick}
    >
      {getSocialIcon()}
      {platform.charAt(0).toUpperCase() + platform.slice(1)}
    </button>
  );
};

// Sticky Share Component
const StickyShare: React.FC<{
  likesCount?: string;
  commentsCount?: string;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}> = ({ likesCount, commentsCount, onLike, onComment, onShare }) => {
  return (
    <div className="sticky bottom-6 inset-x-0 text-center">
      <div className="inline-block bg-white shadow-md rounded-full py-3 px-4 dark:bg-neutral-800">
        <div className="flex items-center gap-x-1.5">
          {/* Like Button */}
          <div className="hs-tooltip inline-block">
            <button
              type="button"
              className="hs-tooltip-toggle flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
              onClick={onLike}
            >
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
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {likesCount || "0"}
              <span
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm dark:bg-black"
                role="tooltip"
              >
                Like
              </span>
            </button>
          </div>

          <div className="block h-3 border-e border-gray-300 mx-3 dark:border-neutral-600"></div>

          {/* Comment Button */}
          <div className="hs-tooltip inline-block">
            <button
              type="button"
              className="hs-tooltip-toggle flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
              onClick={onComment}
            >
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
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
              {commentsCount || "0"}
              <span
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm dark:bg-black"
                role="tooltip"
              >
                Comment
              </span>
            </button>
          </div>

          <div className="block h-3 border-e border-gray-300 mx-3 dark:border-neutral-600"></div>

          {/* Share Button */}
          <button
            type="button"
            className="flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
            onClick={onShare}
          >
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
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" x2="12" y1="2" y2="15" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

// Breadcrumb Component
const Breadcrumb: React.FC<{ category?: string; title?: string }> = ({
  category,
  title,
}) => {
  if (!category && !title) return null;

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a
            href="/blog"
            className="text-gray-700 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500"
          >
            Blog
          </a>
          <ChevronRight />
        </li>
        {category && (
          <li className="inline-flex items-center">
            <span className="text-gray-700 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500">
              {category}
            </span>
            <ChevronRight />
          </li>
        )}
        <li className="inline-flex items-center">
          <span className="text-gray-500 dark:text-neutral-500">{title}</span>
        </li>
      </ol>
    </nav>
  );
};

// Tag Component
const TagList: React.FC<{ tags?: Array<{ name: string; url?: string }> }> = ({
  tags,
}) => {
  if (!tags?.length) return null;

  return (
    <div className="mt-8">
      {tags.map((tag, index) =>
        tag.url ? (
          <a
            key={index}
            href={tag.url}
            className="m-1 inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          >
            {tag.name}
          </a>
        ) : (
          <span
            key={index}
            className="m-1 inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-neutral-200"
          >
            {tag.name}
          </span>
        ),
      )}
    </div>
  );
};

const ChevronRight: React.FC = () => (
  <svg
    className="w-5 h-5 text-gray-500 mx-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const Post: React.FC<{ blok: PostBlok }> = ({ blok }) => {
  const getContainerMaxWidth = () => {
    switch (blok.container_max_width) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      case "2xl":
        return "max-w-2xl";
      case "3xl":
        return "max-w-3xl";
      default:
        return "max-w-3xl";
    }
  };

  // Helper function to get image URL from Storyblok asset
  const getImageUrl = (
    image: string | { filename: string } | null | undefined,
  ): string | null => {
    if (!image) return null;
    if (typeof image === "string") return image;
    if (typeof image === "object" && image.filename) return image.filename;
    return null;
  };

  // Prepare author data for new component
  const authorData: AuthorBlok = blok.author_details || {
    name: blok.author,
    image: blok.author_image,
  };

  const imageUrl = getImageUrl(blok.image);

  // Debug logging for development
  if (import.meta.env.DEV) {
    console.log("Post component debug:", {
      layout_style: blok.layout_style,
      image: blok.image,
      imageUrl,
      title: blok.title,
    });
  }

  return (
    <motion.div
      key="animation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...storyblokEditable(blok)}
    >
      {/* Hero Section - Conditional based on layout style */}
      {blok.layout_style === "hero" && imageUrl && (
        <div
          className="w-screen h-auto bg-cover bg-center flex justify-center items-center flex-wrap lg:flex-nowrap p-10 lg:px-60 lg:py-60"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(160, 174, 192, 0.52), rgba(121, 206, 199, 0.73)),url(${imageUrl})`,
          }}
        >
          <div className="justify-center flex-row mr-20 max-w-[1200px] px-4 md:px-8">
            <div>
              <h1 className="text-white font-bold leading-tight text-xl lg:text-5xl md:text-xl sm:text-[20px]">
                {blok.title}
              </h1>
              {blok.intro && (
                <p className="text-white font-light leading-tight text-xl md:text-3xl sm:text-[20px]">
                  {blok.intro}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Debug message for hero layout without image */}
      {import.meta.env.DEV && blok.layout_style === "hero" && !imageUrl && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Debug: Hero Layout Issue</p>
          <p>Layout style is set to 'hero' but no valid image URL found.</p>
          <p>Image data: {JSON.stringify(blok.image)}</p>
        </div>
      )}

      {/* Article Content */}
      <div
        className={`${getContainerMaxWidth()} px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto`}
      >
        <div className="max-w-2xl">
          {/* Breadcrumbs */}
          {blok.show_breadcrumbs && (
            <Breadcrumb category={blok.category} title={blok.title} />
          )}

          {/* Enhanced Author Section */}
          <BlogAuthor
            author={authorData}
            date={blok.date}
            readTime={blok.read_time}
            showTooltip={true}
          />

          {/* Article Header for Simple Layout */}
          {blok.layout_style !== "hero" && (
            <div className="space-y-5 md:space-y-8 mb-8">
              <div className="space-y-3">
                <h1 className="text-2xl font-bold md:text-3xl dark:text-white">
                  {blok.title}
                </h1>
                {blok.intro && (
                  <p className="text-lg text-gray-800 dark:text-neutral-200">
                    {blok.intro}
                  </p>
                )}
              </div>
              {/* Featured Image for Simple Layout */}
              {imageUrl && (
                <figure>
                  <img
                    className="w-full object-cover rounded-xl"
                    src={imageUrl}
                    alt={blok.title || "Article image"}
                  />
                </figure>
              )}
            </div>
          )}

          {/* Social Share Buttons */}
          {blok.show_social_share && (
            <div className="flex items-center gap-x-2 mb-8">
              <SocialShareButton platform="twitter" />
              <SocialShareButton platform="facebook" />
              <SocialShareButton platform="linkedin" />
            </div>
          )}

          {/* Article Content */}
          <div className="space-y-5 md:space-y-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {blok.long_text && render(blok.long_text)}
            </div>

            {/* Nested Storyblok Components */}
            {blok.blocks?.map((nestedBlok) => (
              <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}

            {/* Tags */}
            <TagList tags={blok.tags} />
          </div>
        </div>
      </div>

      {/* Sticky Share Bar */}
      {blok.show_sticky_share && (
        <StickyShare
          likesCount={blok.likes_count}
          commentsCount={blok.comments_count}
          onLike={() => console.log("Like clicked")}
          onComment={() => console.log("Comment clicked")}
          onShare={() => console.log("Share clicked")}
        />
      )}
    </motion.div>
  );
};

export default Post;

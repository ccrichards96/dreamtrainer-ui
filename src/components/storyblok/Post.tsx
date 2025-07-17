import React from 'react'
import { storyblokEditable, SbBlokData, StoryblokComponent } from "@storyblok/react"
import { render } from "storyblok-rich-text-react-renderer"
import { motion } from "framer-motion"

interface PostBlok extends SbBlokData {
  title?: string;
  intro?: string;
  image?: string;
  author?: string;
  author_image?: {
    filename: string;
  };
  date?: string;
  long_text?: {
    type: 'doc';
    content: Array<{
      type: string;
      content?: Array<any>;
      text?: string;
      [key: string]: any;
    }>;
  };
  blocks?: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;
}

const BlogAuthor: React.FC<{ name?: string; date?: string; image?: string }> = ({ name, date, image }) => {
  return (
    <div className="mt-2 flex items-center space-x-2">
      <img
        className="h-10 w-10 rounded-full object-cover"
        src={image}
        alt={`Avatar of ${name}`}
      />
      <span className="font-medium">{name}</span>
      <span>—</span>
      <span>{date}</span>
    </div>
  );
};

const ChevronRight: React.FC = () => (
  <svg 
    className="w-5 h-5 text-gray-500"
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

const Post: React.FC<{blok: PostBlok}> = ({ blok }) => {
  return (
    <motion.div
      key="animation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        {...storyblokEditable(blok)}
        className="w-screen h-auto bg-cover bg-center flex justify-center items-center flex-wrap lg:flex-nowrap p-10 lg:px-60 lg:py-60"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(160, 174, 192, 0.52), rgba(121, 206, 199, 0.73)),url(${blok.image})`
        }}
      >
        <div className="justify-center flex-row mr-20 max-w-[1200px] px-4 md:px-8">
          <div>
            <h1 className="text-white font-bold leading-tight text-xl lg:text-5xl md:text-xl sm:text-[20px]">
              {blok.title}
            </h1>
            <p className="text-white font-light leading-tight text-xl md:text-3xl sm:text-[20px]">
              {blok.intro}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-xl">
          <div className="pt-10 space-y-2">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a href="/blog" className="text-gray-700 hover:text-blue-600">Blogs</a>
                  <ChevronRight />
                </li>
                <li className="inline-flex items-center">
                  <span className="text-gray-500">{blok.title}</span>
                </li>
              </ol>
            </nav>
            
            <BlogAuthor 
              date={blok.date} 
              name={blok.author} 
              image={blok.author_image?.filename} 
            />
            
            <div className="prose max-w-none">
              {blok.long_text && render(blok.long_text)}
            </div>

            {blok.blocks?.map((nestedBlok) => (
              <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Post

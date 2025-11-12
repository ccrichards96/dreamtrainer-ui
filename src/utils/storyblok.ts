import {
  apiPlugin,
  storyblokInit,
  useStoryblokApi,
  useStoryblok,
  storyblokEditable,
  ISbStoryData,
} from "@storyblok/react";

// Import all components that will be used in Storyblok
import Grid from "../components/storyblok/Grid";
import Button from "../components/storyblok/Button";
import Text, { RichTextField } from "../components/storyblok/Text";
import Header from "../components/storyblok/Header";
import Row from "../components/storyblok/Row";
import Column from "../components/storyblok/Column";
import Container from "../components/storyblok/Container";
import Image from "../components/storyblok/Image";
import Hero from "../components/storyblok/Hero";
import Features from "../components/storyblok/Features";
import Page from "../components/storyblok/Page";
import Post from "../components/storyblok/Post";
import Icon from "../components/storyblok/Icon";
import Section from "../components/storyblok/Section";
import Spacer from "../components/storyblok/Spacer";
import Testimonial from "../components/storyblok/Testimonial";
import Accordion from "../components/storyblok/Accordion";
import Video from "../components/storyblok/Video";

const components = {
  grid: Grid,
  button: Button,
  text: Text,
  RichTextField: RichTextField,
  header: Header,
  row: Row,
  column: Column,
  container: Container,
  image: Image,
  hero: Hero,
  features: Features,
  page: Page,
  post: Post,
  icon: Icon,
  section: Section,
  spacer: Spacer,
  testimonial: Testimonial,
  accordion: Accordion,
  video: Video
};

// Determine which token to use based on environment
// In development/staging mode, use preview token to get draft stories
// In production, use delivery token to get published stories only
const isDevelopment = import.meta.env.VITE_MODE === "development" || import.meta.env.VITE_MODE === "staging";
const accessToken = isDevelopment 
  ? import.meta.env.VITE_STORYBLOK_PREVIEW_API_TOKEN 
  : import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN;

// Initialize Storyblok with environment-specific configuration
storyblokInit({
  accessToken,
  use: [apiPlugin],
  apiOptions: {
    region: "eu",
    cache: {
      clear: "auto",
      type: "memory",
    },
  },
  components,
  enableFallbackComponent: true,
  bridge: isDevelopment, // Enable visual editor bridge in development and staging
});

// Helper function to get the correct version based on environment
export const getStoryblokVersion = (): "draft" | "published" => {
  const mode = import.meta.env.VITE_MODE;
  console.log("Current mode:", mode);
  return mode === "development" || mode === "staging" ? "draft" : "published";
};

// Export commonly used utilities
export { useStoryblokApi, useStoryblok, storyblokEditable, components };

// Export useful types
export type { ISbStoryData };

// Type for Storyblok blocks (can be used in your components)
export interface StoryblokBlock {
  _uid: string;
  component: string;
  [key: string]: unknown;
}

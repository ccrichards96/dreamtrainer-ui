import { 
  apiPlugin, 
  storyblokInit, 
  useStoryblokApi,
  storyblokEditable,
  ISbStoryData 
} from "@storyblok/react";

// Import all components that will be used in Storyblok
import Grid from '../components/storyblok/Grid';
import Button from '../components/storyblok/Button';
import Text from '../components/storyblok/Text';
import Header from '../components/storyblok/Header';
import Row from '../components/storyblok/Row';
import Column from '../components/storyblok/Column';
import Image from '../components/storyblok/Image';
import HeroContainer from '../components/storyblok/HeroContainer';
import Page from '../components/storyblok/Page';
// import Post from '../components/storyblok/Post';
import Icon from '../components/storyblok/Icon';

const components = {
  grid: Grid,
  button: Button,
  text: Text,
  header: Header,
  row: Row,
  column: Column,
  image: Image,
  hero_container: HeroContainer,
  page: Page,
//   post: Post,
  icon: Icon
};

// Initialize Storyblok with preview mode support
const getStoryblokApi = storyblokInit({
  accessToken: import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN,
  use: [apiPlugin],
  apiOptions: {
    region: "eu",
    cache: { 
      clear: 'auto',
      type: 'memory'
    }
  },
  components,
  enableFallbackComponent: true,
  bridge: true // Enable bridge for both dev and production for preview mode
});

// Export commonly used utilities
export { 
  useStoryblokApi,
  getStoryblokApi,
  storyblokEditable,
  components
};

// Export useful types
export type { ISbStoryData };

// Type for Storyblok blocks (can be used in your components)
export interface StoryblokBlock {
  _uid: string;
  component: string;
  [key: string]: unknown;
}

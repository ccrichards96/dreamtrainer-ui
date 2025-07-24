import React from 'react'
import { storyblokEditable, SbBlokData, StoryblokComponent } from "@storyblok/react"

interface ContainerBlok extends SbBlokData {
  content: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centerContainer?: boolean;
  horizontalPadding?: string;
  verticalPadding?: string;
  margin?: string;
  responsiveBreakpoint?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  backgroundColor?: string;
  customClasses?: string;
}

const Container: React.FC<{blok: ContainerBlok}> = ({ blok }) => {
  // Base container classes
  const baseClasses = ['w-full'];
  
  // Handle responsive container based on breakpoint
  if (blok.responsiveBreakpoint && blok.responsiveBreakpoint !== 'none') {
    baseClasses.push(`${blok.responsiveBreakpoint}:container`);
    if (blok.centerContainer) {
      baseClasses.push(`${blok.responsiveBreakpoint}:mx-auto`);
    }
  } else {
    // Handle max-width for non-responsive containers
    if (blok.maxWidth && blok.maxWidth !== 'none') {
      if (blok.maxWidth === 'full') {
        baseClasses.push('w-full');
      } else {
        baseClasses.push('container');
        // Apply specific max-width if needed
        switch (blok.maxWidth) {
          case 'sm':
            baseClasses.push('max-w-sm');
            break;
          case 'md':
            baseClasses.push('max-w-md');
            break;
          case 'lg':
            baseClasses.push('max-w-lg');
            break;
          case 'xl':
            baseClasses.push('max-w-xl');
            break;
          case '2xl':
            baseClasses.push('max-w-2xl');
            break;
        }
      }
    } else {
      baseClasses.push('container');
    }
    
    // Center container if specified
    if (blok.centerContainer) {
      baseClasses.push('mx-auto');
    }
  }
  
  // Add padding classes with proper CSS custom properties
  const customStyles: React.CSSProperties = {};
  
  if (blok.horizontalPadding) {
    // Support both px values and Tailwind classes
    if (blok.horizontalPadding.includes('px') || blok.horizontalPadding.includes('rem') || blok.horizontalPadding.includes('%')) {
      customStyles.paddingLeft = blok.horizontalPadding;
      customStyles.paddingRight = blok.horizontalPadding;
    } else {
      // Assume it's a Tailwind class
      baseClasses.push(`px-${blok.horizontalPadding}`);
    }
  }
  
  if (blok.verticalPadding) {
    // Support both px values and Tailwind classes
    if (blok.verticalPadding.includes('px') || blok.verticalPadding.includes('rem') || blok.verticalPadding.includes('%')) {
      customStyles.paddingTop = blok.verticalPadding;
      customStyles.paddingBottom = blok.verticalPadding;
    } else {
      // Assume it's a Tailwind class
      baseClasses.push(`py-${blok.verticalPadding}`);
    }
  }
  
  // Add margin if specified
  if (blok.margin) {
    if (blok.margin.includes('px') || blok.margin.includes('rem') || blok.margin.includes('%')) {
      customStyles.margin = blok.margin;
    } else {
      // Assume it's a Tailwind class
      baseClasses.push(`m-${blok.margin}`);
    }
  }
  
  // Add background color if specified
  if (blok.backgroundColor) {
    if (blok.backgroundColor.startsWith('#') || blok.backgroundColor.startsWith('rgb') || blok.backgroundColor.startsWith('hsl')) {
      customStyles.backgroundColor = blok.backgroundColor;
    } else {
      // Assume it's a Tailwind class
      baseClasses.push(`bg-${blok.backgroundColor}`);
    }
  }
  
  // Add custom classes if specified
  if (blok.customClasses) {
    baseClasses.push(blok.customClasses);
  }
  
  const classes = baseClasses.filter(Boolean).join(' ');

  return (
    <div {...storyblokEditable(blok)} className={classes} style={customStyles}>
      {blok.content?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  )
}

export default Container

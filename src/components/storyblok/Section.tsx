import React from 'react'
import { storyblokEditable, SbBlokData, StoryblokComponent } from "@storyblok/react"

interface SectionBlok extends SbBlokData {
  content: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;
  // Padding options
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  // Margin options
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  // Background options
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';
  // Additional styling
  minHeight?: string;
  maxWidth?: string;
  customClasses?: string;
}

const Section: React.FC<{blok: SectionBlok}> = ({ blok }) => {
  const baseClasses = ['w-full'];
  const customStyles: React.CSSProperties = {};

  // Handle padding
  if (blok.paddingTop) {
    if (blok.paddingTop.includes('px') || blok.paddingTop.includes('rem') || blok.paddingTop.includes('%') || blok.paddingTop.includes('vh')) {
      customStyles.paddingTop = blok.paddingTop;
    } else {
      baseClasses.push(`pt-${blok.paddingTop}`);
    }
  }

  if (blok.paddingBottom) {
    if (blok.paddingBottom.includes('px') || blok.paddingBottom.includes('rem') || blok.paddingBottom.includes('%') || blok.paddingBottom.includes('vh')) {
      customStyles.paddingBottom = blok.paddingBottom;
    } else {
      baseClasses.push(`pb-${blok.paddingBottom}`);
    }
  }

  if (blok.paddingLeft) {
    if (blok.paddingLeft.includes('px') || blok.paddingLeft.includes('rem') || blok.paddingLeft.includes('%') || blok.paddingLeft.includes('vw')) {
      customStyles.paddingLeft = blok.paddingLeft;
    } else {
      baseClasses.push(`pl-${blok.paddingLeft}`);
    }
  }

  if (blok.paddingRight) {
    if (blok.paddingRight.includes('px') || blok.paddingRight.includes('rem') || blok.paddingRight.includes('%') || blok.paddingRight.includes('vw')) {
      customStyles.paddingRight = blok.paddingRight;
    } else {
      baseClasses.push(`pr-${blok.paddingRight}`);
    }
  }

  // Handle margins
  if (blok.marginTop) {
    if (blok.marginTop.includes('px') || blok.marginTop.includes('rem') || blok.marginTop.includes('%') || blok.marginTop.includes('vh')) {
      customStyles.marginTop = blok.marginTop;
    } else {
      baseClasses.push(`mt-${blok.marginTop}`);
    }
  }

  if (blok.marginBottom) {
    if (blok.marginBottom.includes('px') || blok.marginBottom.includes('rem') || blok.marginBottom.includes('%') || blok.marginBottom.includes('vh')) {
      customStyles.marginBottom = blok.marginBottom;
    } else {
      baseClasses.push(`mb-${blok.marginBottom}`);
    }
  }

  if (blok.marginLeft) {
    if (blok.marginLeft.includes('px') || blok.marginLeft.includes('rem') || blok.marginLeft.includes('%') || blok.marginLeft.includes('vw')) {
      customStyles.marginLeft = blok.marginLeft;
    } else {
      baseClasses.push(`ml-${blok.marginLeft}`);
    }
  }

  if (blok.marginRight) {
    if (blok.marginRight.includes('px') || blok.marginRight.includes('rem') || blok.marginRight.includes('%') || blok.marginRight.includes('vw')) {
      customStyles.marginRight = blok.marginRight;
    } else {
      baseClasses.push(`mr-${blok.marginRight}`);
    }
  }

  // Handle background color
  if (blok.backgroundColor) {
    if (blok.backgroundColor.startsWith('#') || blok.backgroundColor.startsWith('rgb') || blok.backgroundColor.startsWith('hsl')) {
      customStyles.backgroundColor = blok.backgroundColor;
    } else {
      baseClasses.push(`bg-${blok.backgroundColor}`);
    }
  }

  // Handle background image
  if (blok.backgroundImage) {
    customStyles.backgroundImage = `url(${blok.backgroundImage})`;
    customStyles.backgroundSize = blok.backgroundSize || 'cover';
    customStyles.backgroundPosition = blok.backgroundPosition || 'center';
    customStyles.backgroundRepeat = blok.backgroundRepeat || 'no-repeat';
  }

  // Handle min height
  if (blok.minHeight) {
    if (blok.minHeight.includes('px') || blok.minHeight.includes('rem') || blok.minHeight.includes('vh') || blok.minHeight.includes('%')) {
      customStyles.minHeight = blok.minHeight;
    } else {
      baseClasses.push(`min-h-${blok.minHeight}`);
    }
  }

  // Handle max width
  if (blok.maxWidth) {
    if (blok.maxWidth.includes('px') || blok.maxWidth.includes('rem') || blok.maxWidth.includes('vw') || blok.maxWidth.includes('%')) {
      customStyles.maxWidth = blok.maxWidth;
    } else {
      baseClasses.push(`max-w-${blok.maxWidth}`);
    }
  }

  // Add custom classes if specified
  if (blok.customClasses) {
    baseClasses.push(blok.customClasses);
  }

  const classes = baseClasses.filter(Boolean).join(' ');

  return (
    <section {...storyblokEditable(blok)} className={classes} style={customStyles}>
      {blok.content?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </section>
  )
}

export default Section

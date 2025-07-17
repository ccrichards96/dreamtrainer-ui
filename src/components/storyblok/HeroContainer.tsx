import React from 'react'
import { storyblokEditable, SbBlokData, StoryblokComponent } from "@storyblok/react"

interface HeroContainerBlok extends SbBlokData {
  content: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;
  backgroundColor?: string;
  backgroundImage?: string;
  minHeight?: string;
  maxHeight?: string;
  display?: string;
  justifyContent?: string;
  alignItems?: string;
  padding?: string;
  margin?: string;
}

const HeroContainer: React.FC<{blok: HeroContainerBlok}> = ({ blok }) => {
  const classes = [
    'w-full',
    blok.backgroundColor && `bg-[${blok.backgroundColor}]`,
    blok.minHeight && `min-h-[${blok.minHeight}]`,
    blok.maxHeight && `max-h-[${blok.maxHeight}]`,
    blok.display && `${blok.display}`,
    blok.justifyContent && `justify-${blok.justifyContent}`,
    blok.alignItems && `items-${blok.alignItems}`,
    blok.padding && `p-[${blok.padding}]`,
    blok.margin && `m-[${blok.margin}]`,
  ].filter(Boolean).join(' ');

  const style = blok.backgroundImage ? {
    backgroundImage: `url(${blok.backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};

  return (
    <div {...storyblokEditable(blok)} className={classes} style={style}>
      {blok.content?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  )
}

export default HeroContainer

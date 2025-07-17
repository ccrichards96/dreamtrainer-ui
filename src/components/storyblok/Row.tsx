import React from 'react'
import { storyblokEditable, SbBlokData, StoryblokComponent } from "@storyblok/react"

interface RowBlok extends SbBlokData {
  columns: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;
  gap?: string;
  display?: string;
  justifyContent?: string;
  alignItems?: string;
  flexDirection?: string;
  flexWrap?: string;
  padding?: string;
  margin?: string;
}

const Row: React.FC<{blok: RowBlok}> = ({ blok }) => {
  const classes = [
    'flex',
    blok.gap && `gap-[${blok.gap}]`,
    blok.display && `${blok.display}`,
    blok.justifyContent && `justify-${blok.justifyContent}`,
    blok.alignItems && `items-${blok.alignItems}`,
    blok.flexDirection && `flex-${blok.flexDirection}`,
    blok.flexWrap && `flex-${blok.flexWrap}`,
    blok.padding && `p-[${blok.padding}]`,
    blok.margin && `m-[${blok.margin}]`,
  ].filter(Boolean).join(' ');

  return (
    <div {...storyblokEditable(blok)} className={classes}>
      {blok.columns?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  )
}

export default Row

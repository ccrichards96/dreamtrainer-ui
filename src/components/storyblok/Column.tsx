import React from 'react'
import { storyblokEditable, SbBlokData, StoryblokComponent } from "@storyblok/react"

interface ColumnBlok extends SbBlokData {
  content: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;

  display?: string;
  width?: string;
  justify?: string;
  height?: string;
  padding?: string;
  max_width?: string;
  max_height?: string;
  color?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  overflow?: string;
}

const Column = ({ blok }: { blok: ColumnBlok }) => {
  const classes = [
    'flex-grow',
    'items-center',
    blok.display || 'block',
    blok.width || 'w-auto',
    blok.justify && `justify-${blok.justify}`,
    blok.height || 'h-auto',
    blok.padding || 'p-0',
    blok.max_width && `max-w-[${blok.max_width}]`,
    blok.max_height && `max-h-[${blok.max_height}]`,
    blok.color && `text-[${blok.color}]`,
    blok.borderRadius && `rounded-[${blok.borderRadius}]`,
    blok.borderWidth && `border-[${blok.borderWidth}]`,
    blok.borderColor && `border-[${blok.borderColor}]`,
    blok.overflow && `overflow-${blok.overflow}`,
  ].filter(Boolean).join(' ');

  return (
    <div {...storyblokEditable(blok)} className={classes}>
      {blok.content?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  )
}

export default Column

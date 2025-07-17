import React from 'react'
import { storyblokEditable, SbBlokData, StoryblokComponent } from '@storyblok/react'

interface GridBlok extends SbBlokData {
  columns: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;
  templateColumns?: string;
  gap?: string;
  rowGap?: string;
  columnGap?: string;
  autoFlow?: string;
  autoRows?: string;
  autoColumns?: string;
  padding?: string;
  margin?: string;
}

const defaultGridStyles = {
  gap: '4', // Default to gap-4 (1rem)
  rowGap: undefined, // Use gap by default
  columnGap: undefined, // Use gap by default
  autoFlow: 'row', // Default flow direction
  autoRows: 'auto', // Default auto sizing
  autoColumns: 'auto', // Default auto sizing
  padding: '0',
  margin: '0'
};

const Grid: React.FC<{blok: GridBlok}> = ({ blok }) => {
  const styles = {
    gap: blok.gap || defaultGridStyles.gap,
    rowGap: blok.rowGap || defaultGridStyles.rowGap,
    columnGap: blok.columnGap || defaultGridStyles.columnGap,
    autoFlow: blok.autoFlow || defaultGridStyles.autoFlow,
    autoRows: blok.autoRows || defaultGridStyles.autoRows,
    autoColumns: blok.autoColumns || defaultGridStyles.autoColumns,
    padding: blok.padding || defaultGridStyles.padding,
    margin: blok.margin || defaultGridStyles.margin,
  };

  const classes = [
    'grid', // Base grid class always included
    blok.templateColumns ? `grid-cols-[${blok.templateColumns}]` : 'grid-cols-1', // Default to single column
    blok.gap ? `gap-[${blok.gap}]` : `gap-${styles.gap}`,
    styles.rowGap && `row-gap-[${styles.rowGap}]`,
    styles.columnGap && `column-gap-[${styles.columnGap}]`,
    `grid-flow-${styles.autoFlow}`,
    styles.autoRows !== 'auto' && `auto-rows-[${styles.autoRows}]`,
    styles.autoColumns !== 'auto' && `auto-cols-[${styles.autoColumns}]`,
    styles.padding !== '0' && `p-[${styles.padding}]`,
    styles.margin !== '0' && `m-[${styles.margin}]`,
  ].filter(Boolean).join(' ');

  return (
    <div {...storyblokEditable(blok)} className={classes}>
      {blok.columns?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  )
}

export default Grid

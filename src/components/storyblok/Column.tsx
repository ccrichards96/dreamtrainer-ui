import React from 'react'
import { storyblokEditable, SbBlokData, StoryblokComponent } from "@storyblok/react"

interface ColumnBlok extends SbBlokData {
  content: Array<{
    _uid: string;
    component: string;
    [key: string]: unknown;
  }>;

  // Layout System Properties
  layout_type?: 'flex' | 'grid';
  
  // Flex-based Column Properties
  flex_basis?: string;
  flex_grow?: boolean;
  flex_shrink?: boolean;
  flex_direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  
  // Grid-based Column Properties  
  grid_cols?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  grid_col_span?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'full';
  grid_col_start?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13';
  grid_col_end?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13';
  grid_rows?: '1' | '2' | '3' | '4' | '5' | '6';
  grid_row_span?: '1' | '2' | '3' | '4' | '5' | '6' | 'full';
  grid_row_start?: '1' | '2' | '3' | '4' | '5' | '6' | '7';
  grid_row_end?: '1' | '2' | '3' | '4' | '5' | '6' | '7';
  
  // Responsive Properties
  sm_cols?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  md_cols?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  lg_cols?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  xl_cols?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  
  // Alignment Properties (following Preline patterns)
  align_items?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify_content?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align_self?: 'auto' | 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  
  // Spacing Properties (following Preline patterns)
  gap?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '14' | '16' | '20' | '24' | '28' | '32';
  gap_x?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '14' | '16' | '20' | '24' | '28' | '32';
  gap_y?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '14' | '16' | '20' | '24' | '28' | '32';
  padding?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '14' | '16' | '20' | '24' | '28' | '32';
  margin?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '14' | '16' | '20' | '24' | '28' | '32';
  
  // Display Properties
  display?: 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'hidden';
  
  // Sizing Properties
  width?: 'auto' | 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '2/4' | '3/4' | '1/5' | '2/5' | '3/5' | '4/5' | '1/6' | '5/6' | '1/12' | '2/12' | '3/12' | '4/12' | '5/12' | '6/12' | '7/12' | '8/12' | '9/12' | '10/12' | '11/12';
  height?: 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit';
  min_width?: 'none' | '0' | 'full' | 'min' | 'max' | 'fit' | 'prose';
  max_width?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'min' | 'max' | 'fit' | 'prose';
  min_height?: 'none' | '0' | 'full' | 'screen' | 'min' | 'max' | 'fit';
  max_height?: 'none' | 'full' | 'screen' | 'min' | 'max' | 'fit';
  
  // Visual Properties
  background_color?: string;
  text_color?: string;
  border_width?: '0' | '1' | '2' | '4' | '8';
  border_color?: string;
  border_radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';
  
  // Overflow Properties  
  overflow?: 'auto' | 'hidden' | 'visible' | 'scroll';
  overflow_x?: 'auto' | 'hidden' | 'visible' | 'scroll';
  overflow_y?: 'auto' | 'hidden' | 'visible' | 'scroll';
}

const Column = ({ blok }: { blok: ColumnBlok }) => {
  const layoutType = blok.layout_type || 'flex';
  
  // Base classes following Preline UI patterns
  const baseClasses = [];
  
  // Always set the layout type (no display override)
  baseClasses.push(layoutType === 'grid' ? 'grid' : 'flex');
  
  // Layout-specific classes
  if (layoutType === 'flex') {
    // Flex properties - ensure flex direction is always set
    const flexDirection = blok.flex_direction || 'column'; // Default to column for better layout control
    baseClasses.push(`flex-${flexDirection}`);
    
    if (blok.flex_grow) {
      baseClasses.push('flex-grow');
    }
    
    if (blok.flex_shrink) {
      baseClasses.push('flex-shrink');
    }
    
    if (blok.flex_basis) {
      baseClasses.push(`basis-${blok.flex_basis}`);
    }
  } else if (layoutType === 'grid') {
    // Grid properties
    if (blok.grid_cols) {
      baseClasses.push(`grid-cols-${blok.grid_cols}`);
    }
    
    if (blok.grid_rows) {
      baseClasses.push(`grid-rows-${blok.grid_rows}`);
    }
    
    if (blok.grid_col_span) {
      baseClasses.push(blok.grid_col_span === 'full' ? 'col-span-full' : `col-span-${blok.grid_col_span}`);
    }
    
    if (blok.grid_col_start) {
      baseClasses.push(`col-start-${blok.grid_col_start}`);
    }
    
    if (blok.grid_col_end) {
      baseClasses.push(`col-end-${blok.grid_col_end}`);
    }
    
    if (blok.grid_row_span) {
      baseClasses.push(blok.grid_row_span === 'full' ? 'row-span-full' : `row-span-${blok.grid_row_span}`);
    }
    
    if (blok.grid_row_start) {
      baseClasses.push(`row-start-${blok.grid_row_start}`);
    }
    
    if (blok.grid_row_end) {
      baseClasses.push(`row-end-${blok.grid_row_end}`);
    }
    
    // Grid alignment - use correct grid alignment properties
    // Note: In Grid, align-items controls vertical alignment, justify-items controls horizontal alignment
    if (blok.align_items) {
      baseClasses.push(`items-${blok.align_items}`); // This works for grid too (align-items)
    }
    
    if (blok.justify_content) {
      baseClasses.push(`justify-items-${blok.justify_content}`); // Use justify-items for grid horizontal alignment
    }
  }
  
  // Responsive grid columns (for both flex and grid)
  if (blok.sm_cols) {
    baseClasses.push(`sm:grid-cols-${blok.sm_cols}`);
  }
  
  if (blok.md_cols) {
    baseClasses.push(`md:grid-cols-${blok.md_cols}`);
  }
  
  if (blok.lg_cols) {
    baseClasses.push(`lg:grid-cols-${blok.lg_cols}`);
  }
  
  if (blok.xl_cols) {
    baseClasses.push(`xl:grid-cols-${blok.xl_cols}`);
  }
  
  // Alignment classes - handle differently for flex vs grid
  if (layoutType === 'flex') {
    // Flex alignment
    if (blok.align_items) {
      baseClasses.push(`items-${blok.align_items}`);
    }
    
    if (blok.justify_content) {
      baseClasses.push(`justify-${blok.justify_content}`);
    }
    
    if (blok.align_self) {
      baseClasses.push(`self-${blok.align_self}`);
    }
  }
  // Grid alignment is handled above in the grid section to avoid conflicts
  
  // Spacing classes
  if (blok.gap) {
    baseClasses.push(`gap-${blok.gap}`);
  }
  
  if (blok.gap_x) {
    baseClasses.push(`gap-x-${blok.gap_x}`);
  }
  
  if (blok.gap_y) {
    baseClasses.push(`gap-y-${blok.gap_y}`);
  }
  
  if (blok.padding) {
    baseClasses.push(`p-${blok.padding}`);
  }
  
  if (blok.margin) {
    baseClasses.push(`m-${blok.margin}`);
  }
  
  // Sizing classes - simplified to just width auto by default
  baseClasses.push('w-auto'); // Auto width for proper alignment
  
  // Visual classes
  if (blok.background_color) {
    baseClasses.push(blok.background_color.startsWith('bg-') ? blok.background_color : `bg-${blok.background_color}`);
  }
  
  if (blok.text_color) {
    baseClasses.push(blok.text_color.startsWith('text-') ? blok.text_color : `text-${blok.text_color}`);
  }
  
  if (blok.border_width) {
    baseClasses.push(blok.border_width === '0' ? 'border-0' : `border-${blok.border_width}`);
  }
  
  if (blok.border_color) {
    baseClasses.push(blok.border_color.startsWith('border-') ? blok.border_color : `border-${blok.border_color}`);
  }
  
  if (blok.border_radius) {
    baseClasses.push(blok.border_radius === 'none' ? 'rounded-none' : `rounded-${blok.border_radius}`);
  }
  
  if (blok.shadow) {
    baseClasses.push(blok.shadow === 'none' ? 'shadow-none' : `shadow-${blok.shadow}`);
  }
  
  // Overflow classes
  if (blok.overflow) {
    baseClasses.push(`overflow-${blok.overflow}`);
  }
  
  if (blok.overflow_x) {
    baseClasses.push(`overflow-x-${blok.overflow_x}`);
  }
  
  if (blok.overflow_y) {
    baseClasses.push(`overflow-y-${blok.overflow_y}`);
  }
  
  const finalClasses = baseClasses.filter(Boolean).join(' ');

  // Debug logging for centering issues (remove in production)
  if (blok.align_items === 'center') {
    console.log('Column centering debug:', {
      layoutType,
      flex_direction: blok.flex_direction,
      align_items: blok.align_items,
      classes: finalClasses
    });
  }

  return (
    <div {...storyblokEditable(blok)} className={finalClasses}>
      {blok.content?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  )
}

export default Column

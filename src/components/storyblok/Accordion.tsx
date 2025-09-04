import React, { useState } from 'react'
import { storyblokEditable, SbBlokData } from "@storyblok/react"
import { ChevronDown } from 'lucide-react'

interface AccordionItemBlok {
  _uid: string;
  title: string;
  content: string;
  is_open_by_default?: boolean;
}

interface AccordionBlok extends SbBlokData {
  items: AccordionItemBlok[];
  // Styling options
  variant?: 'default' | 'bordered' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  allow_multiple?: boolean;
  custom_classes?: string;
}

const Accordion: React.FC<{blok: AccordionBlok}> = ({ blok }) => {
  // State to track which items are open
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    const defaultOpen = new Set<string>();
    blok.items?.forEach(item => {
      if (item.is_open_by_default) {
        defaultOpen.add(item._uid);
      }
    });
    return defaultOpen;
  });

  const toggleItem = (uid: string) => {
    const newOpenItems = new Set(openItems);
    
    if (blok.allow_multiple) {
      // Allow multiple items open
      if (newOpenItems.has(uid)) {
        newOpenItems.delete(uid);
      } else {
        newOpenItems.add(uid);
      }
    } else {
      // Only allow one item open at a time
      if (newOpenItems.has(uid)) {
        newOpenItems.clear();
      } else {
        newOpenItems.clear();
        newOpenItems.add(uid);
      }
    }
    
    setOpenItems(newOpenItems);
  };

  // Base classes
  const baseClasses = ['hs-accordion-group'];
  
  // Variant classes
  const variantClasses = {
    default: '',
    bordered: 'border border-gray-200 rounded-lg',
    filled: 'bg-gray-50 rounded-lg'
  };

  // Size classes for spacing
  const sizeClasses = {
    sm: 'space-y-2',
    md: 'space-y-3', 
    lg: 'space-y-4'
  };

  const variant = blok.variant || 'default';
  const size = blok.size || 'md';

  // Combine classes
  const accordionClasses = [
    ...baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    blok.custom_classes
  ].filter(Boolean).join(' ');

  return (
    <div {...storyblokEditable(blok)} className={accordionClasses}>
      {blok.items?.map((item) => {
        const isOpen = openItems.has(item._uid);
        
        return (
          <div 
            key={item._uid} 
            className={`hs-accordion ${variant === 'bordered' ? 'border-b border-gray-200 last:border-b-0' : ''}`}
          >
            {/* Accordion Header */}
            <button
              type="button"
              onClick={() => toggleItem(item._uid)}
              className={`
                hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full 
                font-semibold text-gray-800 transition hover:text-gray-500 focus:outline-none focus:text-gray-500
                ${size === 'sm' ? 'text-sm py-2' : size === 'lg' ? 'text-lg py-4' : 'text-base py-3'}
                ${variant === 'filled' ? 'px-4' : ''}
                ${isOpen ? 'text-blue-600' : ''}
              `}
              aria-expanded={isOpen}
              aria-controls={`hs-accordion-content-${item._uid}`}
            >
              {item.title}
              <ChevronDown 
                className={`
                  block shrink-0 size-5 text-gray-600 group-hover:text-gray-500 transition-transform duration-200
                  ${isOpen ? 'rotate-180' : ''}
                `}
              />
            </button>

            {/* Accordion Content */}
            <div
              id={`hs-accordion-content-${item._uid}`}
              className={`
                hs-accordion-content overflow-hidden transition-all duration-300
                ${isOpen ? 'block' : 'hidden'}
              `}
              role="region"
              aria-labelledby={`hs-accordion-heading-${item._uid}`}
            >
              <div className={`
                text-gray-600 leading-relaxed
                ${size === 'sm' ? 'text-sm pb-2' : size === 'lg' ? 'text-base pb-4' : 'text-sm pb-3'}
                ${variant === 'filled' ? 'px-4' : ''}
              `}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default Accordion

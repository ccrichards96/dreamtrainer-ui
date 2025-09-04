import React from 'react'
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { render, NODE_PARAGRAPH, NODE_HEADING, NODE_UL, NODE_OL, NODE_IMAGE, MARK_LINK, NODE_HR, NODE_QUOTE } from "storyblok-rich-text-react-renderer"
import { storyblokEditable, SbBlokData, StoryblokRichText } from "@storyblok/react"

// interface TextBlok extends SbBlokData {
//   text_align?: string;
//   padding?: string;
//   font_weight?: string;
//   margin_top?: string;
//   margin_left?: string;
//   margin_right?: string;
//   margin_bottom?: string;
//   color?: string;
//   size_base?: string;
//   text: string;
// }

const defaultTextStyles = {
  text_align: 'left',
  padding: '0',
  font_weight: '400',
  margin_top: '0',
  margin_left: '0',
  margin_right: '0',
  margin_bottom: '0',
  color: '#000000',
  size_base: '16px'
};

const TextComponent: React.FC<{blok: any}> = ({blok}) => {
  // Merge defaults with provided values
  const styles = {
    text_align: blok.text_align || defaultTextStyles.text_align,
    padding: blok.padding || defaultTextStyles.padding,
    font_weight: blok.font_weight || defaultTextStyles.font_weight,
    margin_top: blok.margin_top || defaultTextStyles.margin_top,
    margin_left: blok.margin_left || defaultTextStyles.margin_left,
    margin_right: blok.margin_right || defaultTextStyles.margin_right,
    margin_bottom: blok.margin_bottom || defaultTextStyles.margin_bottom,
    color: blok.color || defaultTextStyles.color,
    size_base: blok.size_base || defaultTextStyles.size_base
  };

  const classes = [
    `text-${styles.text_align}`,
    `p-[${styles.padding}]`,
    `font-[${styles.font_weight}]`,
    `mt-[${styles.margin_top}]`,
    `ml-[${styles.margin_left}]`,
    `mr-[${styles.margin_right}]`,
    `mb-[${styles.margin_bottom}]`,
    `text-[${styles.color}]`,
    `text-[${styles.size_base}]`,
  ].join(' ');

  return (
    <p {...storyblokEditable(blok)} className={classes}>
      {blok.name}
    </p>
  )
}

interface StoryblokContent {
  type: string;
  content?: Array<StoryblokContent>;
  attrs?: {
    level?: number;
    href?: string;
    target?: string;
    linktype?: string;
    src?: string;
    alt?: string;
    [key: string]: unknown;
  };
  text?: string;
}

const defaultRichTextStyles = {
  color: '#000000',
  paragraph_fontsize: '16px'
};

const defaultHeadingSizes = {
  1: 'text-4xl',
  2: 'text-3xl',
  3: 'text-2xl',
  4: 'text-xl',
  5: 'text-lg',
  6: 'text-base'
} as const;

interface MarkLinkProps {
  href?: string;
  target?: string;
  linktype?: string;
}

// export const RichTextField: React.FC<{blok: RichTextBlok}> = ({blok}) => {
//   const styles = {
//     color: blok.color || defaultRichTextStyles.color,
//     paragraph_fontsize: blok.paragraph_fontsize || defaultRichTextStyles.paragraph_fontsize
//   };

//   return (
//     <div {...storyblokEditable(blok)}>
//       {render(blok.data, {
//         nodeResolvers: {
//           [NODE_PARAGRAPH]: (children: React.ReactNode) => (
//             <p>
//               {children}
//             </p>
//           ),
//           [NODE_HEADING]: (children: React.ReactNode, { level = 1 }: { level?: number }) => {
//             const Tag = `h${level}` as keyof JSX.IntrinsicElements;
//             return React.createElement(
//               Tag,
//               { 
//                 className: `${defaultHeadingSizes[level as keyof typeof defaultHeadingSizes]} text-[${styles.color}]`
//               },
//               children
//             );
//           },
//           [NODE_UL]: (children: React.ReactNode) => (
//             <ul className={`ml-[45px] text-[${styles.color}]`}>
//               {children}
//             </ul>
//           ),
//           [NODE_HR]: () => (
//             <hr className="my-4" />
//           ),
//           [NODE_OL]: (children: React.ReactNode) => (
//             <ol className={`ml-[45px] text-[${styles.color}]`}>
//               {children}
//             </ol>
//           ),
//           [NODE_IMAGE]: (_: React.ReactNode, { src, alt }: { src?: string; alt?: string }) => (
//             <img 
//               src={src}
//               alt={alt || ''}
//               className="h-[450px] my-10 mx-auto"
//             />
//           ),
//           [NODE_QUOTE]: (children: React.ReactNode) => (
//             <div className="flex flex-nowrap">
//               <div className="pr-2">
//                 <FaQuoteLeft className="w-4 h-4 text-[#5DC0DF]" />
//               </div>
//               <div>
//                 {children}
//               </div>
//               <div className="pl-2 mt-auto">
//                 <FaQuoteRight className="w-4 h-4 text-[#5DC0DF]" />
//               </div>
//             </div>
//           ),
//         },
//         markResolvers: {
//           [MARK_LINK]: (children: React.ReactNode, props: MarkLinkProps) => {
//             const { href = '', target, linktype } = props;
//             const classes = "text-blue-600 hover:text-blue-800 underline";
            
//             if (linktype === 'email') {
//               return <a href={`mailto:${href}`} className={classes}>{children}</a>;
//             }
//             if (href.match(/^(https?:)?\/\//)) {
//               return <a href={href} target={target || '_blank'} rel="noopener noreferrer" className={classes}>{children}</a>;
//             }
//             return <a href={href} className={classes}>{children}</a>;
//           }
//         }
//       })}
//     </div>
//   )
// }

export const RichTextField: React.FC<{blok: any}> = ({blok}) => {
  return <StoryblokRichText doc={blok.text} />
}

export default TextComponent

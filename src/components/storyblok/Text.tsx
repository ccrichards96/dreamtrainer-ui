import React from "react";
// import { render, NODE_PARAGRAPH, NODE_HEADING, NODE_UL, NODE_OL, NODE_IMAGE, MARK_LINK, NODE_HR, NODE_QUOTE } from "storyblok-rich-text-react-renderer"
import { storyblokEditable, StoryblokRichText } from "@storyblok/react";

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
  text_align: "left",
  padding: "0",
  font_weight: "400",
  margin_top: "0",
  margin_left: "0",
  margin_right: "0",
  margin_bottom: "0",
  color: "#000000",
  size_base: "16px",
};

const TextComponent: React.FC<{ blok: any }> = ({ blok }) => {
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
    size_base: blok.size_base || defaultTextStyles.size_base,
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
  ].join(" ");

  return (
    <p {...storyblokEditable(blok)} className={classes}>
      {blok.name}
    </p>
  );
};

export const RichTextField: React.FC<{ blok: any }> = ({ blok }) => {
  return <StoryblokRichText doc={blok.text} />;
};

export default TextComponent;

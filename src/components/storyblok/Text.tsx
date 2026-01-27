import React from "react";
import { storyblokEditable, StoryblokRichText } from "@storyblok/react";

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

  const classes = `text-${styles.text_align}`;

  const style = {
    padding: styles.padding,
    fontWeight: styles.font_weight,
    marginTop: styles.margin_top,
    marginLeft: styles.margin_left,
    marginRight: styles.margin_right,
    marginBottom: styles.margin_bottom,
    color: styles.color,
    fontSize: styles.size_base,
  };

  return (
    <p {...storyblokEditable(blok)} className={classes} style={style}>
      {blok.name}
    </p>
  );
};

export const RichTextField: React.FC<{ blok: any }> = ({ blok }) => {
  return <StoryblokRichText doc={blok.text} />;
};

export default TextComponent;


import React from "react";


const ButtonComponent = ({ blok }) => {
  // Compose Tailwind classes from blok props
  const baseClasses = [
    "inline-block",
    "transition-colors",
    blok.bgColor ? blok.bgColor : "bg-blue-600",
    blok.color ? blok.color : "text-white",
    blok.rounded ? blok.rounded : "rounded-md",
    blok.fontSize ? blok.fontSize : "text-base",
    blok.width ? blok.width : "w-auto",
    blok.padding ? blok.padding : "px-4 py-2",
    blok.margin_top ? blok.margin_top : "",
    blok.margin_left ? blok.margin_left : "",
    blok.margin_right ? blok.margin_right : "",
    blok.margin_bottom ? blok.margin_bottom : "",
  ].join(" ");

  // Compose hover/focus classes
  const hoverClasses = blok.hover_bg || blok.hover_color
    ? `hover:${blok.hover_bg ? blok.hover_bg : ''} hover:${blok.hover_color ? blok.hover_color : ''}`
    : "hover:bg-blue-700 hover:text-white";
  const focusClasses = blok.focus_bg || blok.focus_color
    ? `focus:${blok.focus_bg ? blok.focus_bg : ''} focus:${blok.focus_color ? blok.focus_color : ''}`
    : "focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <a
      href={blok.link}
      className={`${baseClasses} ${hoverClasses} ${focusClasses}`.replace(/ +/g, ' ')}
    >
      {blok.text}
    </a>
  );
};

export default ButtonComponent;

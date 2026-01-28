import React from "react";
import * as FontAwesome from "react-icons/fa";
import * as DevIcons from "react-icons/di";
import * as SimpleIcons from "react-icons/si";
import * as BootrapIcons from "react-icons/bs";
import * as PiIcons from "react-icons/pi";

interface IconBlok {
  name: string;
  iconLib: string;
  size: string | number;
  color: string;
}

const IconComponent = ({ blok }: { blok: IconBlok }) => {
  let ic: React.ComponentType | null = null;
  let icon: React.ReactElement | null = null;
  if (blok.name !== "") {
    try {
      if (blok.iconLib === "fa") {
        ic = FontAwesome[blok.name as keyof typeof FontAwesome];
        icon = ic ? React.createElement(ic) : null;
      } else if (blok.iconLib === "di") {
        ic = DevIcons[blok.name as keyof typeof DevIcons];
        icon = ic ? React.createElement(ic) : null;
      } else if (blok.iconLib === "si") {
        ic = SimpleIcons[blok.name as keyof typeof SimpleIcons];
        icon = ic ? React.createElement(ic) : null;
      } else if (blok.iconLib === "bs") {
        ic = BootrapIcons[blok.name as keyof typeof BootrapIcons];
        icon = ic ? React.createElement(ic) : null;
      } else if (blok.iconLib === "pi") {
        ic = PiIcons[blok.name as keyof typeof PiIcons];
        icon = ic ? React.createElement(ic) : null;
      } else {
        ic = FontAwesome[blok.name as keyof typeof FontAwesome];
        icon = ic ? React.createElement(ic) : null;
      }
    } catch (e) {
      console.log(e);
    }
  }

  if (blok.name !== "") {
    return (
      <span style={{ fontSize: blok.size, color: blok.color, margin: "0px auto" }}>{icon}</span>
    );
  } else {
    return <span style={{ fontSize: blok.size, color: blok.color }}></span>;
  }
};

export default IconComponent;

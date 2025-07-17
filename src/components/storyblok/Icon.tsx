import React from 'react'
import * as FontAwesome from "react-icons/fa";
import * as DevIcons from "react-icons/di";
import * as SimpleIcons from "react-icons/si";
import * as BootrapIcons from "react-icons/bs";

const IconComponent = ({blok}) => {
  let ic:any = null;
  let icon:any = null;
  if(blok.name !== ""){
    try{
      if(blok.iconLib === "fa"){
        ic = FontAwesome[blok.name];
        icon = React.createElement(ic);
      }
      else if(blok.iconLib === "di"){
        ic = DevIcons[blok.name];
        icon = React.createElement(ic);
      }
      else if(blok.iconLib === "si"){
        ic = SimpleIcons[blok.name];
        icon = React.createElement(ic);
      }
      else if(blok.iconLib === "bs"){
        ic = BootrapIcons[blok.name];
        icon = React.createElement(ic);
      }

    }
    catch(e){
      console.log(e)
    }
  }

  if(blok.name !== ""){
    return (
      <span style={{fontSize:blok.size, color:blok.color}}>
      {icon}
      </span>
    )
  }else{
    return (
      <span style={{fontSize:blok.size, color:blok.color}}>
      </span>
    )
  }

}

export default IconComponent

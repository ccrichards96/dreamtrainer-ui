import React from 'react'

interface ImageBlok {
  image_url: {
    filename: string;
  };
  alt?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  boxsize_base?: string;
}

const ImageComponent: React.FC<{blok: ImageBlok}> = ({blok}) => {
  const classes = [
    blok.boxsize_base && `w-[${blok.boxsize_base}] h-[${blok.boxsize_base}]`,
    blok.width && `w-[${blok.width}]`,
    blok.height && `h-[${blok.height}]`,
    blok.borderRadius && `rounded-[${blok.borderRadius}]`,
  ].filter(Boolean).join(' ');

  return (
    <img 
      src={blok.image_url.filename} 
      alt={blok.alt || ''} 
      className={classes}
    />
  )
}

export default ImageComponent

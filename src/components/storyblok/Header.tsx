interface HeaderBlok {
  headerType: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: string;
  size_base?: string;
  text: string;
}

const Header = ({ blok }: { blok: HeaderBlok }) => {
  const HeaderTag = blok.headerType;
  const classes = [
    blok.color ? `text-[${blok.color}]` : '',
    blok.size_base || 'text-2xl',
    'font-bold'
  ].filter(Boolean).join(' ');

  return (
    <HeaderTag className={classes}>
      {blok.text}
    </HeaderTag>
  )
}

export default Header

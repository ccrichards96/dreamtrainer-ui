interface HeaderBlok {
  headerType: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color?: string;
  size_base?: string;
  text: string;
  text_align?: "left" | "center" | "right" | "justify";
}

const Header = ({ blok }: { blok: HeaderBlok }) => {
  const HeaderTag = blok.headerType;
  const classes = [
    blok.size_base || "text-2xl",
    blok.text_align ? `text-${blok.text_align}` : "text-left",
    "font-bold",
  ]
    .filter(Boolean)
    .join(" ");

  const style = blok.color ? { color: blok.color } : undefined;

  return (
    <HeaderTag className={classes} style={style}>
      {blok.text}
    </HeaderTag>
  );
};

export default Header;

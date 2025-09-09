import { StoryblokComponent, SbBlokData } from "@storyblok/react";

type PageProps = {
  blok: {
    body?: SbBlokData[];
  };
};

export default function Page({ blok }: PageProps) {
  return (
    <main>
      {blok.body?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
}

import { DefaultSeo } from "next-seo";

export const SEO = () => {
  return (
    <DefaultSeo
      openGraph={{
        type: "website",
        url: "https://res.cloudinary.com/dkiqn0gqg/image/upload/v1661641790/kawal-kawan-OG_tbw62x.png",
        title: "Kawal Kawan",
        images: [
          {
            url: "https://res.cloudinary.com/dkiqn0gqg/image/upload/v1661641790/kawal-kawan-OG_tbw62x.png",
            alt: "kawal kawan og",
            type: "image/png",
            height: 630,
            width: 1200,
          },
        ],
      }}
      twitter={{
        handle: "@faz_razq",
        cardType: "summary",
      }}
      titleTemplate={"%s | Kawal Kawan "}
      defaultTitle='Kawal Kawan'
      description='Your mental health is important! Share your struggle here and get support from the others
        that have gone through the same. Remember, you are not alone.
        '
    />
  );
};

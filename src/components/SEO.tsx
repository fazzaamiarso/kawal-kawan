import { DefaultSeo } from "next-seo";

export const SEO = () => {
  return (
    <DefaultSeo
      openGraph={{
        type: "website",
        url: "",
        title: "Kawal Kawan",
        images: [
          {
            url: "",
            alt: "",
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

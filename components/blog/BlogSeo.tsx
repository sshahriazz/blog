import React from "react";
import { NextSeo } from "next-seo";

interface BlogSeoProps {
  title: string;
  description: string;
  url: string;
  image: string;
  twitterUsername: string;
}

const BlogSeo: React.FC<BlogSeoProps> = ({
  title,
  description,
  url,
  image,
  twitterUsername,
}) => {
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        type: "website",
        url,
        title,
        description,
        images: [
          {
            url: image,
            alt: title,
          },
        ],
      }}
      twitter={{
        handle: twitterUsername,
        site: twitterUsername,
        cardType: "summary_large_image",
      }}
    />
  );
};

export default BlogSeo;

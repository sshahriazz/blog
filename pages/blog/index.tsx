import { Stack } from "@mantine/core";
import dynamic from "next/dynamic";
import { Blog, User } from "@prisma/client";
import { serialize } from "@utils/prisma";
import { GetServerSideProps } from "next";
import React from "react";
const ArticleCardVertical = dynamic(() =>
  import("@components/blog/article-card").then((mod) => mod.ArticleCardVertical)
);
const Layout = dynamic(() => import("@components/layout/home-layout"));
import client from "@lib/prismadb";

export type BlogUser = Blog & {
  author?: User | null;
};
const Blog = ({ data }: { data: BlogUser[] }) => {
  return (
    <Layout>
      <Stack spacing={"sm"}>
        {data.map((dt: BlogUser) => (
          <ArticleCardVertical key={dt.title + Math.random()} {...dt} />
        ))}
      </Stack>
    </Layout>
  );
};
export const getServerSideProps: GetServerSideProps<{
  data: any;
}> = async () => {
  const data = await client.blog.findMany({
    where: { isPublished: true },
    include: { author: true },
    orderBy: {
      createdAt: "asc",
    },
  });

  return {
    props: {
      data: serialize(data),
    },
    revalidate: 60 * 60 * 24,
  };
};

export default Blog;

import { Stack } from "@mantine/core";
import { Blog, User } from "@prisma/client";
import { serialize } from "@utils/prisma";
import { GetServerSideProps } from "next";
import React from "react";
import { ArticleCardVertical } from "../../components/blog/article-card";
import Layout from "../../components/layout/home-layout";
import client from "../../lib/prismadb";

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
  };
};

export default Blog;

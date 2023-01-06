import { GetStaticProps } from "next";
import React from "react";
import Layout from "../../components/layout/home-layout";
import client from "../../lib/prismadb";

const Blog = ({ post }: { post: any }) => {
  return <Layout>{JSON.stringify(post)}</Layout>;
};

export default Blog;
export async function getStaticPaths() {
  const posts = await client.blog.findMany({ where: { isPublished: true } });
  const newPath = [];
  for (let post of posts) {
    newPath.push({ params: { id: post.id } });
  }

  return {
    paths: newPath || [],
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const post = await client.blog.findMany({
    where: { id: context.params?.id as string },
    select: {
      author: {
        select: {
          id: true,
          image: true,
          name: true,
        },
      },
      seo: { include: { metaSocial: true } },
      coverImage: true,
      id: true,
      title: true,
    },
  });
  return {
    props: { post: post },
  };
};

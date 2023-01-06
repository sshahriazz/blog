import { Avatar, Card, Grid, Image, Text } from "@mantine/core";
import { Blog } from "@prisma/client";
import { useAtom } from "jotai";
import { GetStaticProps } from "next";
import React from "react";
import TableOfContentsFloating from "../../components/blog/table-of-content";
import DisplayContent from "../../components/DisplayContent";
import Layout from "../../components/layout/home-layout";
import UserInfoCard from "../../components/user/UserInfoCard";
import client from "../../lib/prismadb";
const user = {
  image:
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
  avatar:
    "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
  name: "Bill Headbanger",
  job: "Fullstack engineer",
  stats: [
    {
      value: "34K",
      label: "Followers",
    },
    {
      value: "187",
      label: "Follows",
    },
    {
      value: "1.6K",
      label: "Posts",
    },
  ],
};

const SingleBlog = ({ post }: { post: any }) => {
  return (
    <Layout>
      <Grid grow gutter="xs">
        <Grid.Col span={8}>
          <Image
            radius="md"
            height={180}
            src="https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            alt="Random unsplash image"
          />
          <Avatar src={post.author.image} alt="it's me" />
          <Text>{post.author.name}</Text>
          <Text size={25}>{post?.title}</Text>
          <Text>Tags - coming soon</Text>
          <DisplayContent content={post?.content} />
        </Grid.Col>
        <Grid.Col span={4}>
          <UserInfoCard {...user} />
        </Grid.Col>
      </Grid>
    </Layout>
  );
};

export async function getStaticPaths() {
  const posts = await client.blog.findMany();
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
  const post = await client.blog.findUnique({
    where: { id: context.params?.id as string },
    select: {
      author: {
        select: {
          image: true,
          name: true,
        },
      },
      seo: { include: { metaSocial: true } },
      coverImage: true,
      title: true,
      content: true,
    },
  });

  return {
    props: { post },
  };
};
export default SingleBlog;

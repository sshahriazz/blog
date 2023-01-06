import { Stack } from "@mantine/core";
import { Blog } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import React from "react";
import { ArticleCardVertical } from "../../components/blog/article-card";
import HomeLayout from "../../components/layout/home-layout";
import client from "../../lib/prismadb";

const MyBlogs = ({ data }: { data: Blog[] }) => {
  return (
    <HomeLayout>
      <Stack spacing={"sm"}>
        {data.map((dt: Blog) => (
          <ArticleCardVertical key={dt.title + Math.random()} {...dt} />
        ))}
      </Stack>
    </HomeLayout>
  );
};
export const getServerSideProps: GetServerSideProps<{
  data: any;
}> = async (ctx) => {
  const { req } = ctx;
  const token = await getToken({ req });

  const data = await client.blog.findMany({
    where: { authorId: token?.sub! },
  });

  return {
    props: {
      data,
    },
  };
};
export default MyBlogs;

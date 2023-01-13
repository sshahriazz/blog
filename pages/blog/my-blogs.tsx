import dynamic from "next/dynamic";
import React from "react";

import { Stack, Text } from "@mantine/core";
import { Blog } from "@prisma/client";
import { serialize } from "@utils/prisma";
import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import client from "../../lib/prismadb";

const ArticleCardVertical = dynamic(() =>
  import("@components/blog/article-card").then((mod) => mod.ArticleCardVertical)
);
const HomeLayout = dynamic(() => import("@components/layout/home-layout"));

const MyBlogs = ({ data }: { data: Blog[] }) => {
  return (
    <HomeLayout>
      {data.length > 0 ? (
        <Stack spacing={"sm"}>
          {data.map((dt: Blog) => (
            <ArticleCardVertical key={dt.title + Math.random()} {...dt} />
          ))}
        </Stack>
      ) : (
        <Text>You have no blogs</Text>
      )}
    </HomeLayout>
  );
};
export const getServerSideProps: GetServerSideProps<{
  data: any;
}> = async (ctx) => {
  const { req } = ctx;
  const token = await getToken({ req });

  if (token) {
    const data = await client.blog.findMany({
      where: { authorId: token?.sub! },
    });

    return {
      props: {
        data: serialize(data),
      },
    };
  } else {
    return {
      props: {
        data: [],
      },
    };
  }
};
export default MyBlogs;

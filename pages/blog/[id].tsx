import {
  Avatar,
  createStyles,
  Grid,
  Image,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconGauge,
  IconHome2,
  IconSettings,
  IconUser,
  TablerIcon,
} from "@tabler/icons";
import { GetStaticProps } from "next";
import React, { useState } from "react";
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
const mockdata = [
  { icon: IconHome2, label: "Home" },
  { icon: IconGauge, label: "Dashboard" },
  { icon: IconDeviceDesktopAnalytics, label: "Analytics" },
  { icon: IconCalendarStats, label: "Releases" },
  { icon: IconUser, label: "Account" },
  { icon: IconFingerprint, label: "Security" },
  { icon: IconSettings, label: "Settings" },
];
const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  active: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));
interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  onClick?(): void;
}
function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();

  return (
    <Tooltip label={label} position="right" transitionDuration={0}>
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}
const SingleBlog = ({ post }: { post: any }) => {
  const [active, setActive] = useState(2);
  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <Layout>
      <Grid grow gutter="xs">
        <Grid.Col span={1}>
          <Stack justify="end" spacing={0}>
            {links}
          </Stack>
        </Grid.Col>
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
        <Grid.Col span={3}>
          <UserInfoCard {...user} />
        </Grid.Col>
      </Grid>
    </Layout>
  );
};

export async function getStaticPaths() {
  const posts = await client.blog.findMany();
  const newPath = [];
  for (const post of posts) {
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

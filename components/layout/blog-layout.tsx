import dynamic from "next/dynamic";
const TopNav = dynamic(() => import("@components/navigation/top-nav"));
import { Box, Container, Space } from "@mantine/core";
import React from "react";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <TopNav />
      <Space h={16} />
      <Container size={"xl"}>{children}</Container>
    </Box>
  );
};

export default BlogLayout;

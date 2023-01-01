import type { ReactNode } from "react";
import TopNav from "../navigation/top-nav";
import { VerticalNav } from "../navigation/vertical-nav";
import { Container, Flex } from "@mantine/core";
import Footer from "./footer";
import { links } from "../../utils/navigation";

export default function InteractiveLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Container>
      <TopNav />
      <Flex>
        <VerticalNav />
        <main className="h-full">{children}</main>
      </Flex>
      <Footer links={links} />
    </Container>
  );
}

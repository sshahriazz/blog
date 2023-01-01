import Footer from "./footer";
import type { ReactNode } from "react";
import TopNav from "../navigation/top-nav";
import { links } from "../../utils/navigation";
import { Container } from "@mantine/core";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <Container>
      <TopNav />
      <main className="h-full">{children}</main>
      <Footer links={links} />
    </Container>
  );
}

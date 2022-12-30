import Footer from "./footer";
import type { ReactNode } from "react";
import TopNav from "../navigation/top-nav";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopNav />
      <main className="h-full">{children}</main>
      <Footer />
    </>
  );
}

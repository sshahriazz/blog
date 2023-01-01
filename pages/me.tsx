import { Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "../components/layout/home-layout";

export default function MePage() {
  // const { data } = useSession();
  const { data } = useSession();
  const [content, setContent] = useState();

  async function handleBlogCreation() {
    const res = await fetch("/api/blogs/blog?isPublished=true", {
      method: "POST",
      body: JSON.stringify({
        blogId: "63b17d5a8af712317f992099",
        // content: "THis is another content",
      }),
    });
    const json = await res.json();
    if (json.content) {
      setContent(json);
    }
  }

  return (
    <Layout>
      <Button onClick={handleBlogCreation}>Create a blog</Button>
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </Layout>
  );
}

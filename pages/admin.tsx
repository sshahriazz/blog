import Layout from "../components/layout/home-layout";

export default function Page() {
  return (
    <Layout>
      <h1 className="text-purple-400">This page is protected by Middleware</h1>
      <p>Only admin users can see this page.</p>
      <p>
        To learn more about the NextAuth middleware see&nbsp;
        <a href="https://docs-git-misc-docs-nextauthjs.vercel.app/configuration/nextjs#middleware">
          the docs
        </a>
        .
      </p>
    </Layout>
  );
}

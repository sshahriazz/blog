import { trpc } from "@utils/trpc";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
const FeaturesGrid = dynamic(() =>
  import("@components/home/Features").then((mod) => mod.FeaturesGrid)
);
const HeroBullets = dynamic(() =>
  import("@components/home/HeroBullets").then((mod) => mod.HeroBullets)
);
const HomeLayout = dynamic(() => import("@components/layout/home-layout"));

export default function Page() {
  const { isLoading, error, data } = trpc.healthCheck.useQuery();
  console.log(error, data);
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>{data}</div>
      <NextSeo
        title="Welcome - Home"
        description="Home page fo the blog site"
      />
      <HomeLayout>
        <HeroBullets />
        <FeaturesGrid
          title={"Integrate effortlessly with any technology stack"}
          description={
            "Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when hunger drives it to try biting a Steel-type Pokémon."
          }
        />
      </HomeLayout>
    </>
  );
}

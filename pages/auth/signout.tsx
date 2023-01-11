import { Button } from "@mantine/core";
import { CtxOrReq } from "next-auth/client/_utils";
import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

const Signout = ({ csrfToken }: { csrfToken: string }) => {
  const router = useRouter();

  return (
    <div>
      <form action={`/api/auth/signout`} method="POST">
        <h1 className="display-4 text-center mb-3">Sign out</h1>
        <p className="text-muted text-center mb-5">
          Are you sure you want to sign out?
        </p>
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <Button className="w-100 mb-3" size="lg" onClick={() => router.back()}>
          Go back
        </Button>
        <Button className="w-100 mb-3" type="submit" size="lg">
          Sign out
        </Button>
      </form>
    </div>
  );
};

export async function getServerSideProps(context: CtxOrReq) {
  const csrfToken = await getCsrfToken(context);

  return {
    props: { csrfToken },
  };
}
export default Signout;

import { CtxOrReq } from "next-auth/client/_utils";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";

export default function SignIn({
  providers,
  csrfToken,
}: {
  providers: [{ name: string; id: string }];
  csrfToken: string;
}) {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <>
          {provider.name === "Credentials" && (
            <form method="post" action="/api/auth/callback/credentials">
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <label>
                Username
                <input name="username" type="text" />
              </label>
              <label>
                Email
                <input name="username" type="email" />
              </label>
              <label>
                Password
                <input name="password" type="password" />
              </label>
              <button type="submit">Sign in</button>
            </form>
          )}
          {provider.name !== "Credentials" && (
            <div key={provider.name}>
              <button onClick={() => signIn(provider.id)}>
                Sign in with {provider.name}
              </button>
            </div>
          )}
        </>
      ))}
    </>
  );
}

export async function getServerSideProps(context: CtxOrReq) {
  const providers = await getProviders();

  return {
    props: { providers, csrfToken: await getCsrfToken(context) },
  };
}

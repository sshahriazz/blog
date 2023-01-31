import { procedure, router } from "server/trpc";
import { postRouter } from "./blog";

export const appRouter = router({
  healthCheck: procedure.query(({ input }) => "yay!"),
  blog: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

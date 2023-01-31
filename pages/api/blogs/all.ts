import client from "@lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  const token = await getToken({ req });

  if (token && method === "GET") {
    const allPost = await client.blog
      .findMany({
        select: {
          author: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
          coverImage: true,
          id: true,
          title: true,
        },
      })
      .catch((err) => {
        return res.status(500).json({ message: "Blog error, contact admin" });
      });

    return res.status(200).send(allPost);
  }

  return res.send({ status: 404, message: "bad request" });
}

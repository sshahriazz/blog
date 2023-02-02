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
    const draftPost = await client.blog.findMany({
      where: { published: false },
      select: {
        author: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },
        cover: true,
        id: true,
        title: true,
      },
    });

    return res.status(200).send(draftPost);
  }

  return res.status(404).send({ message: "bad request" });
}

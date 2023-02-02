import client from "@lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req;

  const token = await getToken({ req });
  const parsedData = body && JSON.parse(body);
  // creates new blog for current user
  if (token && method === "POST") {
    const findBlog = await client.blog.findUnique({
      where: { id: query.id as string },
    });

    const blog = await client.blog.update({
      where: {
        id: query.id as string,
      },
      data: {
        title: parsedData.title,
        content: parsedData.content,
        published: parsedData.published,
        cover: parsedData.cover,
      },
    });

    return res.status(200).send(blog);
  }

  return res.status(404).send({ message: "bad request" });
}

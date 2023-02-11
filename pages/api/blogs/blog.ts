import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import formidable from "formidable";
import client from "@lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  const form = new formidable.IncomingForm({ multiples: true });
  const token = await getToken({ req });

  if (token && method === "POST") {
    const blog = await client.blog.create({
      data: {
        title: body.title,
        content: body.content,
        published: body.published === "true" ? true : false,
        cover: body.cover,
        tags: {
          connectOrCreate: body.tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        author: { connect: { email: token?.email?.toString() } },
      },
    });
    // .catch((err) => {
    //   return res
    //     .status(500)
    //     .json({ message: "Blog creation error, contact admin" });
    // });

    return res.send(blog);
  }
}

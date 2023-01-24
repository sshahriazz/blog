import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import formidable from "formidable";
import client from "@lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  const form = new formidable.IncomingForm();
  const token = await getToken({ req });

  if (
    token &&
    method === "POST" &&
    (query.isDraft === undefined || query.isPublished === undefined)
  ) {
    form.parse(req, async (err, fields, files) => {
      const blog = await client.blog
        .create({
          data: {
            title: fields.title as string,
            content: fields.content as string,
            isDraft: fields.isDraft === "true" ? true : false,
            isPublished: fields.isPublished === "true" ? true : false,
            coverImage: "",
            tags: {
              connectOrCreate: Array.isArray(fields.tags)
                ? fields.tags.map((tag: string) => ({
                    where: { name: tag },
                    create: { name: tag },
                  }))
                : [],
            },
            author: { connect: { email: token?.email?.toString() } },
          },
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ message: "Blog creation error, contact admin" });
        });

      return res.status(201).json(blog);
    });
  } else {
    return res.status(404).json({ message: "bad request" });
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};

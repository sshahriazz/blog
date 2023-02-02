import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import formidable from "formidable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  const form = new formidable.IncomingForm({ multiples: true });
  const token = await getToken({ req });

  if (token && method === "POST") {
    console.log(req.body, "body");

    // const blog = await client.blog
    //   .create({
    //     data: {
    //       title: fields.title as string,
    //       content: fields.content as string,
    //       isDraft: fields.isDraft === "true" ? true : false,
    //       isPublished: fields.isPublished === "true" ? true : false,
    //       coverImage: "",
    //       tags: {
    //         connectOrCreate:
    //           typeof fields.tags !== "string"
    //             ? fields.tags.map((tag: string) => ({
    //                 where: { name: tag },
    //                 create: { name: tag },
    //               }))
    //             : [
    //                 {
    //                   where: { name: fields.tags },
    //                   create: { name: fields.tags },
    //                 },
    //               ],
    //       },
    //       author: { connect: { email: token?.email?.toString() } },
    //     },
    //   })
    //   .catch((err) => {
    //     return res
    //       .status(500)
    //       .json({ message: "Blog creation error, contact admin" });
    //   });
    // return res.send(blog);
  }
}

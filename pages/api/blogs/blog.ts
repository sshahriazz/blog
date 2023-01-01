import client from "../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { isEmptyObject, isString } from "@tiptap/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req;
  console.log(method, query, body);

  const token = await getToken({ req });
  const parsedData = body && JSON.parse(body);
  // creates new blog for current user
  if (token && method === "POST" && isEmptyObject(query)) {
    const blog = await client.blog.create({
      data: {
        title: parsedData.title,
        content: parsedData.content,
        isDraft: parsedData.isDraft,
        isPublished: parsedData.isPublished,
        author: { connect: { email: token?.email?.toString() } },
      },
    });
    return res.send(blog);
  }
  if (token && method === "POST" && query?.isDraft && query?.isPublished) {
    return res.send({ status: 404, message: "bad request" });
  }
  if (token && method === "POST" && query?.isDraft && parsedData.blogId) {
    // update draft status of a unique blog
    const user = await client.user.findUnique({
      where: { email: token.email! },
    });
    const blog = await client.blog.updateMany({
      where: { authorId: user?.id, id: parsedData.blogId },
      data: {
        isDraft: query.isDraft === "true" ? true : false,
      },
    });
    return res.send(blog);
  }
  // update published status of a unique blog
  if (token && method === "POST" && query?.isPublished && parsedData.blogId) {
    const user = await client.user.findUnique({
      where: { email: token.email! },
    });
    const blog = await client.blog.updateMany({
      where: { authorId: user?.id, id: parsedData.blogId },
      data: {
        isPublished: query.isPublished === "true" ? true : false,
      },
    });
    return res.send(blog);
  }
  return res.send({ status: 404, message: "bad request" });
}

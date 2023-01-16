import client from "../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req;

  const token = await getToken({ req });
  const parsedData = body && JSON.parse(body);
  if (
    token &&
    method === "POST" &&
    (query.isDraft === undefined || query.isPublished === undefined)
  ) {
    const blog = await client.blog.create({
      data: {
        title: parsedData.title,
        content: parsedData.content,
        isDraft: parsedData.isDraft,
        isPublished: parsedData.isPublished,
        coverImage: parsedData.image,
        category: {
          connectOrCreate: {
            where: { name: parsedData.category },
            create: {
              name: parsedData.category,
            },
          },
        },
        tags: {
          connectOrCreate: parsedData.tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        seo: {
          create: {
            keywords: parsedData.seo.keywords,
            canonicalURL: parsedData.seo.canonicalURL,
            metaDescription: parsedData.seo.metaDescription,
            metaImage: parsedData.seo.metaImage,
            metaRobots: parsedData.seo.metaRobots,
            metaTitle: parsedData.seo.metaTitle,
            metaViewPort: parsedData.seo.metaViewPort,
            structuredData: parsedData.seo.structuredData || {},
            metaSocial: {
              create: parsedData.seo.metaSocial,
            },
          },
        },
        author: { connect: { email: token?.email?.toString() } },
      },
    });

    // const updateBlog = await client.blog.update({
    //   where: { id: blog.id },
    //   data: { tags: { connect: [{ name: "test" }] } },
    // });

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

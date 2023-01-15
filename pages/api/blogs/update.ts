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
      include: { seo: { include: { metaSocial: true } } },
    });

    const blog = await client.blog.update({
      where: {
        id: query.id as string,
      },
      data: {
        title: parsedData.title,
        content: parsedData.content,
        isDraft: parsedData.isDraft,
        isPublished: parsedData.isPublished,
        coverImage: parsedData.image,
        seo: {
          update: {
            keywords: parsedData.seo.keywords,
            canonicalURL: parsedData.seo.canonicalURL,
            metaDescription: parsedData.seo.metaDescription,
            metaImage: parsedData.seo.metaImage,
            metaRobots: parsedData.seo.metaRobots,
            metaTitle: parsedData.seo.metaTitle,
            metaViewPort: parsedData.seo.metaViewPort,
            structuredData: parsedData.seo.structuredData || {},
            metaSocial: {
              deleteMany: {
                id: { in: findBlog?.seo?.metaSocial.map(({ id }) => id) },
              },
              createMany: {
                data: parsedData.seo.metaSocial,
              },
            },
          },
        },
      },
    });

    return res.send(blog);
  }

  return res.send({ status: 404, message: "bad request" });
}

import client from "@lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  const token = await getToken({ req });

  if (token && method === "GET") {
    const blogTags = await client.tag.findMany();

    return res.send(blogTags);
  }

  return res.send({ status: 404, message: "bad request" });
}

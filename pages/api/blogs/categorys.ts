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
    const blogCategory = await client.category.findMany();

    return res.send(blogCategory);
  }

  return res.send({ status: 404, message: "bad request" });
}

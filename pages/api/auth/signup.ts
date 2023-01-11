import client from "@lib/prismadb";
import { hash } from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password, username } = req?.body;

    const existingUser = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      const user = await client.user.create({
        data: {
          email,
          password: await hash(password, 12),
          username,
        },
      });

      return res.send({ status: 201, user });
    } else {
      return res.send({ status: 404, message: "bad request" });
    }
  } else {
    //Response for other than POST method
    res.status(500).json({ message: "Route not valid" });
  }
}

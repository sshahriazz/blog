import client from "@lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username } = req?.body;

    const existingUser = await client.user.findUnique({
      where: {
        username,
      },
    });
    if (!existingUser) {
      return res.status(200).json({ message: "Username is available" });
    } else {
      return res.status(404).json({ message: "Username not available" });
    }
  } else {
    res.status(500).json({ message: "Route not valid" });
  }
}

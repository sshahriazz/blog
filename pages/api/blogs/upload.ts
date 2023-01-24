import cloud from "@lib/cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest & { file: File },
  res: NextApiResponse
) {
  // upload a file to cloudinary
  const { method, body } = req;
  const token = await getToken({ req });
  const parsedData = body && JSON.parse(body);
  //grab the file stream from req
  const file = req.file;

  if (token && method === "POST") {
    const upload = await cloud.uploader.upload(file, {
      folder: "blog",
      use_filename: true,
      unique_filename: true,
    });

    return res.send(upload);
  }
}

import { uploadImage } from "@lib/cloudinary";
import { FormidableError, parseForm } from "@lib/parseForm";
import { UploadApiResponse } from "cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{
    data: {
      url: string;
    } | null;
    error: string | null;
  }>
) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      data: null,
      error: "Method Not Allowed",
    });

    return;
  }
  // Just after the "Method Not Allowed" code
  try {
    const { fields, files } = await parseForm(req);
    console.log(fields, files, "fields, files");

    const file = files.cover;
    const url = Array.isArray(file)
      ? file.map((f) => f.filepath)
      : file.filepath;

    const uploadResponse: UploadApiResponse | undefined = await uploadImage(
      url as string
    );

    res.status(200).json({
      data: {
        url: uploadResponse!.secure_url,
      },
      error: null,
    });
  } catch (e) {
    if (e instanceof FormidableError) {
      res.status(e.httpCode || 400).json({ data: null, error: e.message });
    } else {
      console.error(e);
      res.status(500).json({ data: null, error: "Internal Server Error" });
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;

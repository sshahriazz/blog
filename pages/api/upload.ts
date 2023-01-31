import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";
import formidable from "formidable";
cloudinary.v2.config({
  cloud_name: "sample",
  api_key: "874837483274837",
  api_secret: "a676b67565c6767a6767d6767f676fe1",
  secure: true,
});

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log(req);

  const form = formidable({
    multiples: true,
    uploadDir: "./public",
  });

  form.parse(req, async (err, fields, files) => {
    if (files) {
      const image = await cloudinary.v2.uploader.upload("", {
        resource_type: "image",
        public_id: `users/${files.name}`,
        crop: "scale",
        quality: "auto",
      });

      return res.send({ image: image.secure_url });
    } else {
      return;
    }
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return req.method === "POST"
    ? await upload(req, res)
    : res.status(404).send({ message: "bad request" });
}

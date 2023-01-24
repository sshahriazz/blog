import * as cloudinary from "cloudinary";

const cloud = cloudinary.v2.config({
  secure: true,
});

export default cloud;

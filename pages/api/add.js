import dbConnect from "@/utils/dbConnect";
import Urls from "@/models/Urls";
import { customAlphabet } from "nanoid";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
let idLength = 4;
let nanoid = customAlphabet(alphabet, idLength);

const getNormalizedURL = (url) => {
  let urlClass = new URL(url);
  return urlClass.origin.toLowerCase() + urlClass.pathname;
}

export default async function handler(req, res) {
  if (!req.body) {
    res.redirect("/");
    return;
  }
  
  const { url } = JSON.parse(req.body);
  const normalizedURL = getNormalizedURL(url);

  if (normalizedURL.startsWith(process.env.NEXT_PUBLIC_URL)) {
    res.status(200).json({ message: "URL from base website cannot be shortened again!", kind: "error" });
    return;
  }

  await dbConnect();
  let originalExists = await Urls.findOne({ originalUrl: normalizedURL });
  if (originalExists) {
    res.status(200).json({ message: originalExists.shortenedUrl, kind: "exists" });
    return;
  }

  let id = nanoid();
  let created = await Urls.findOne({ shortenedUrl: process.env.NEXT_PUBLIC_URL + id });
  while (created) {
    id = nanoid();
    created = await Urls.findOne({ shortenedUrl: process.env.NEXT_PUBLIC_URL + id });
  }

  let data = { originalUrl: normalizedURL, shortenedUrl: process.env.NEXT_PUBLIC_URL + id, hits: 0 };
  let newUrl = await Urls.create(data).catch(err => console.error(err));
  res.status(200).json({ message: newUrl.shortenedUrl, kind: "created" });
}

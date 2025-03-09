import dbConnect from "@/utils/dbConnect";
import Urls from "@/models/Urls";

export default async function handler(req, res) {
    if (!req.body) {
        res.redirect("/");
        return;
    }

    const { code } = JSON.parse(req.body);
    let shortened = process.env.NEXT_PUBLIC_URL + code;
    await dbConnect();
    let found = await Urls.findOne({ shortenedUrl: shortened });

    if (!found) {
        res.status(200).json({ url: process.env.NEXT_PUBLIC_URL });
        return;
    }

    found.hits += 1;
    found.save();
    res.status(200).json({ url: found.originalUrl });
} 
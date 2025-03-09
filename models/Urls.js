import mongoose, { Schema } from "mongoose";

let UrlSchema = new Schema({
  originalUrl: String,
  shortenedUrl: String,
  hits: Number
});

export default mongoose.models.Urls || mongoose.model("Urls", UrlSchema);
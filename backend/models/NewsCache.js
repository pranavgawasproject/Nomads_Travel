// models/NewsCache.js
import mongoose from "mongoose";

const newsCacheSchema = new mongoose.Schema({
  location: { type: String, required: true }, // "Goa", "Bali", "Bangkok", etc
  scope: { type: String },
  articles: { type: Array, default: [] },
  fetchedAt: { type: Date, default: Date.now },
});

// TTL index → delete automatically after 24h
newsCacheSchema.index({ fetchedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

export default mongoose.model("NewsCache", newsCacheSchema);

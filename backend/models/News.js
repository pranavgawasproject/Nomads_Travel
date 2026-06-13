import mongoose from "mongoose";
const blogSchema = new mongoose.Schema({
  mainTitle: {
    type: String,
    required: true,
  },
  mainImage: {
    type: String,
  },
  mainContent: {
    type: String,
  },
  author: {
    type: String,
  },
  date: {
    type: Date,
  },
  destination: {
    type: String,
  },
  blogType: {
    type: String,
  },
  source: {
    type: String,
  },
  sections: [
    {
      title: String,
      content: String,
      image: String,
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
});

const News = mongoose.model("News", blogSchema);
export default News;

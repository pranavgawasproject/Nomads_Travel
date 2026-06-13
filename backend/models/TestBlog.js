import mongoose from "mongoose";
const testBlogSchema = new mongoose.Schema({
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
});

const TestBlog = mongoose.model("TestBlog", testBlogSchema);
export default TestBlog;

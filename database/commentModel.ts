import mongoose from "mongoose";

let CommentSchema = new mongoose.Schema(
  {
    body: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);
let Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
export default Comment;

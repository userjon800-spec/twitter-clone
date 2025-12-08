import mongoose from "mongoose";

let UserSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    email: String,
    password: String,
    coverImage: String,
    profileImage: String,
  },
  { timestamps: true }
);
let User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;

import { serializeUser } from "../users/serializeUser";

export const serializePost = (post: any) => {
  if (!post) return null;

  return {
    _id: post._id?.toString(),
    body: post.body,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    likes: post.likes || [],
    comments: post.comments || [],
    user: serializeUser(post.user),
  };
};

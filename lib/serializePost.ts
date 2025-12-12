export function serializePost(post: any, currentUserId?: string) {
  return {
    _id: post._id?.toString(),
    body: post.body,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    user: post.user
      ? {
          _id: post.user._id?.toString(),
          name: post.user.name,
          username: post.user.username,
          profileImage: post.user.profileImage,
          email: post.user.email,
        }
      : null,
    likes: Array.isArray(post.likes) ? post.likes.length : 0,
    comments: Array.isArray(post.comments) ? post.comments.length : 0,
    hasLiked:
      currentUserId && Array.isArray(post.likes)
        ? post.likes.some(
            (id: any) => id.toString() === currentUserId.toString()
          )
        : false,
  };
}

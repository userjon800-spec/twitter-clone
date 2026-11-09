export function serializePost(
  post: any,
  currentUserId?: string,
  userBookmarks?: any[],
) {
  return {
    _id: post._id?.toString(),
    body: post.body,
    image: post.image || null,
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
    reposts: Array.isArray(post.reposts) ? post.reposts.length : 0,
    comments: Array.isArray(post.comments) ? post.comments.length : 0,
    hasLiked:
      currentUserId && Array.isArray(post.likes)
        ? post.likes.some(
            (id: any) => id.toString() === currentUserId.toString(),
          )
        : false,
    hasReposted:
      currentUserId && Array.isArray(post.reposts)
        ? post.reposts.some(
            (id: any) => id.toString() === currentUserId.toString(),
          )
        : false,
    hasBookmarked:
      userBookmarks && Array.isArray(userBookmarks)
        ? userBookmarks.some(
            (id: any) => id.toString() === post._id?.toString(),
          )
        : false,
  };
}

export const serializeUser = (user: any) => {
  if (!user) return null;
  return {
    _id: user._id?.toString(),
    name: user.name || "",
    email: user.email || "",
    username: user.username || "",
    profileImage: user.profileImage || "",
  };
};

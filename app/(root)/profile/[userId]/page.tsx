import ProfileBio from "@/components/profile/profileBio";
import ProfileHero from "@/components/profile/profileHero";
import Header from "@/components/shared/header";
import PostFeed from "@/components/shared/postFeed";
import { getUserById } from "@/lib/actions/userAction";
import { authOption } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
const Page = async ({
  params,
}: {
  params: Promise<{ userId: string }> | { userId: string };
}) => {
  const resolvedParams = await Promise.resolve(params);
  const { userId } = resolvedParams;
  let user = await getUserById(userId);
  const session: any = await getServerSession(authOption);
  const currentUserId = session?.currentUser?._id?.toString() || "";

  if (!user) {
    return (
      <>
        <Header label="User not found" isBack />
        <div className="flex justify-center items-center h-40 text-neutral-500">
          Foydalanuvchi topilmadi
        </div>
      </>
    );
  }

  return (
    <>
      <Header label={user?.name} isBack />
      <ProfileHero user={JSON.parse(JSON.stringify(user))} />
      <ProfileBio
        user={JSON.parse(JSON.stringify(user))}
        userId={currentUserId}
      />
      <PostFeed
        user={
          session?.currentUser
            ? JSON.parse(JSON.stringify(session.currentUser))
            : null
        }
        userId={userId}
      />
    </>
  );
};
export default Page;

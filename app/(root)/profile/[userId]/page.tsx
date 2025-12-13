import ProfileBio from "@/components/profile/profileBio";
import ProfileHero from "@/components/profile/profileHero";
import Header from "@/components/shared/header";
import PostFeed from "@/components/shared/postFeed";
import { getUserById } from "@/lib/actions/userAction";
import { authOption } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const Page = async ({ params }: { params: { userId: string } }) => {
  let user = await getUserById(params.userId);
  const session = await getServerSession(authOption);
  return (
    <>
      <Header label={user?.name} isBack />
      <ProfileHero user={JSON.parse(JSON.stringify(user))} />
      <ProfileBio
        user={JSON.parse(JSON.stringify(user))}
        userId={JSON.parse(JSON.stringify(session)).currentUser._id}
      />
      <PostFeed user={JSON.parse(JSON.stringify(session?.currentUser))} userId={params.userId} />
    </>
  );
};

export default Page;

{
  /* <Header label={user?.name!} isBack /> */
}

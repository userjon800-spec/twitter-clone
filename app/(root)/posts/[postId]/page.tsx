"use client";
import CommentItem from "@/components/shared/commentItem";
import Form from "@/components/shared/form";
import Header from "@/components/shared/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sliceText } from "@/lib/utils";
import { IPost } from "@/types";
import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import FormattedText from "@/components/shared/formattedText";
import PostSkeleton from "@/components/shared/postSkeleton";
const Page = () => {
  const routerParams = useParams();
  const postId = routerParams?.postId as string;
  let { data: session, status }: any = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingComment, setIsFetchingComment] = useState(false);
  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<IPost[]>([]);
  let getPost = async () => {
    try {
      if (!postId) return;
      setIsLoading(true);
      let { data } = await axios.get(`/api/posts/${postId}`);
      setPost(data);

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  let getComment = async () => {
    try {
      if (!postId) return;
      setIsFetchingComment(true);
      let { data } = await axios.get(`/api/posts/${postId}/comments`);
      setComments(data);
      setIsFetchingComment(false);
    } catch (error) {
      console.error(error);
      setIsFetchingComment(false);
    }
  };
  useEffect(() => {
    if (postId) {
      getPost();
      getComment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);
  return (
    <>
      <Header label="Posts" isBack />
      {isLoading || status === "loading" ? (
        <PostSkeleton count={1} />
      ) : (
        <>
          <div className="border-b-[1px] border-neutral-800 p-5 bg-neutral-900 transition">
            <div className="flex flex-row items-start gap-3">
              <Avatar>
                <AvatarImage src={post?.user?.profileImage} />
                <AvatarFallback>{post?.user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="w-full">
                <div className="flex flex-row items-center gap-2">
                  <p className="text-white font-semibold cursor-pointer hover:underline">
                    {post?.user?.name}
                  </p>
                  <span className="text-neutral-500 cursor-pointer hover:underline hidden md:block">
                    {post && post?.user?.username
                      ? `@${sliceText(post?.user?.username ?? "", 20)}`
                      : post && sliceText(post?.user?.email ?? "", 20)}
                  </span>
                  <span className="text-neutral-500 text-sm">
                    {post &&
                      post?.createdAt &&
                      formatDistanceToNowStrict(new Date(post?.createdAt))}{" "}
                    ago
                  </span>
                </div>
                <div className="text-white mt-2 text-lg break-words">
                  <FormattedText text={post?.body || ""} />
                </div>
                {post?.image && (
                  <div className="mt-3 relative rounded-2xl overflow-hidden border border-neutral-800 max-h-[450px] w-full">
                    <Image
                      src={post.image}
                      alt="Post media"
                      width={650}
                      height={400}
                      className="w-full object-cover max-h-[450px]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <Form
            placeholder="Post your reply?"
            user={
              session?.currentUser
                ? JSON.parse(JSON.stringify(session.currentUser))
                : null
            }
            isComment
            setPosts={setComments}
            postId={postId}
          />
          {comments &&
            comments.map((comment) => (
              <CommentItem
                comment={comment}
                key={comment._id}
                user={
                  session?.currentUser
                    ? JSON.parse(JSON.stringify(session.currentUser))
                    : null
                }
                setComments={setComments}
                comments={comments}
              />
            ))}
        </>
      )}
    </>
  );
};
export default Page;

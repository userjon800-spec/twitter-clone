"use client";
import { sliceText } from "@/lib/utils";
import { IPost, IUser } from "@/types";
import { Bookmark, Loader2, Repeat, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import { AiFillDelete, AiOutlineMessage } from "react-icons/ai";
import { formatDistanceToNowStrict } from "date-fns";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FormattedText from "./formattedText";

interface Props {
  post: IPost;
  user: IUser;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}
const PostItem = ({ post, user, setPosts }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  let router = useRouter();

  let onDelete = async (e: any) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await axios.delete(`/api/posts`, {
        data: { postId: post._id },
      });
      setIsLoading(false);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
    } catch (error) {
      setIsLoading(false);
      return toast({
        title: "Error",
        description: "Nimadir xato ketdi, Iltimos keyinroq urinib ko'ring",
        variant: "destructive",
      });
    }
  };

  let onLike = async (e: any) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      if (post.hasLiked) {
        await axios.delete("/api/likes", {
          data: {
            postId: post._id,
          },
        });
        let updatePosts = {
          ...post,
          hasLiked: false,
          likes: Math.max(post.likes - 1, 0),
        };
        setPosts((prew) =>
          prew.map((p) => (p._id === post._id ? updatePosts : p)),
        );
      } else {
        await axios.put("/api/likes", {
          postId: post._id,
        });
        let updatePosts = { ...post, hasLiked: true, likes: post.likes + 1 };
        setPosts((prew) =>
          prew.map((p) => (p._id === post._id ? updatePosts : p)),
        );
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return toast({
        title: "Error",
        description: "Nimadir xato ketdi, Iltimos keyinroq urinib ko'ring",
        variant: "destructive",
      });
    }
  };

  let onRepost = async (e: any) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      const { data } = await axios.put("/api/reposts", { postId: post._id });
      let updatePosts = {
        ...post,
        hasReposted: data.hasReposted,
        reposts: data.reposts,
      };
      setPosts((prev) =>
        prev.map((p) => (p._id === post._id ? updatePosts : p)),
      );
      toast({
        title: data.hasReposted ? "Repost qilindi" : "Bekor qilindi",
        description: data.message,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return toast({
        title: "Error",
        description: "Nimadir xato ketdi, iltimos keyinroq urinib ko'ring",
        variant: "destructive",
      });
    }
  };

  let onBookmark = async (e: any) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      const { data } = await axios.put("/api/bookmarks", { postId: post._id });
      let updatePosts = {
        ...post,
        hasBookmarked: data.hasBookmarked,
      };
      setPosts((prev) =>
        prev.map((p) => (p._id === post._id ? updatePosts : p)),
      );
      toast({
        title: data.hasBookmarked ? "Saqlandi" : "Olib tashlandi",
        description: data.message,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return toast({
        title: "Error",
        description: "Nimadir xato ketdi, iltimos keyinroq urinib ko'ring",
        variant: "destructive",
      });
    }
  };

  let onShare = (e: any) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/posts/${post._id}`,
      );
      toast({
        title: "Nusxalandi",
        description: "Post havolasi xotiraga nusxalandi!",
      });
    }
  };

  let goToPost = () => {
    router.push(`/posts/${post._id}`);
  };

  let goToProfile = (e: any) => {
    e.stopPropagation();
    if (post?.user?._id) {
      router.push(`/profile/${post.user._id}`);
    }
  };

  return (
    <div className="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition relative">
      {isLoading && (
        <div className="absolute inset-0 w-full h-full bg-black opacity-50 z-10">
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-sky-500" />
          </div>
        </div>
      )}
      <div
        className="flex flex-row items-start gap-3 cursor-pointer"
        onClick={() => goToPost()}
      >
        <Avatar onClick={goToProfile}>
          <AvatarImage src={post?.user?.profileImage} />
          <AvatarFallback>{post?.user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="w-full overflow-hidden">
          <div
            className="flex flex-row items-center gap-2"
            onClick={goToProfile}
          >
            <p className="text-white font-semibold cursor-pointer hover:underline">
              {post?.user?.name}
            </p>
            <span className="text-neutral-500 cursor-pointer hover:underline hidden md:block">
              {post?.user?.username
                ? `@${sliceText(post?.user?.username ?? "", 16)}`
                : sliceText(post?.user?.email ?? "", 16)}
            </span>
            <span className="text-neutral-500 text-sm">
              {post?.createdAt &&
                formatDistanceToNowStrict(new Date(post.createdAt))}{" "}
              ago
            </span>
          </div>

          <div className="text-white mt-1 break-words">
            <FormattedText text={post?.body} />
          </div>

          {post?.image && (
            <div className="mt-3 relative rounded-2xl overflow-hidden border border-neutral-800 max-h-[400px] w-full">
              <Image
                src={post.image}
                alt="Post attachment"
                width={600}
                height={400}
                className="w-full object-cover max-h-[400px]"
              />
            </div>
          )}

          <div className="flex flex-row items-center justify-between mt-3 max-w-md text-neutral-500">
            {/* Reply / Comment */}
            <div className="flex flex-row items-center gap-2 cursor-pointer transition hover:text-sky-500">
              <AiOutlineMessage size={19} />
              <p className="text-xs">{post?.comments || 0}</p>
            </div>

            {/* Repost */}
            <div
              className={`flex flex-row items-center gap-2 cursor-pointer transition hover:text-green-500 ${
                post?.hasReposted ? "text-green-500" : ""
              }`}
              onClick={onRepost}
            >
              <Repeat size={18} />
              <p className="text-xs">{post?.reposts || 0}</p>
            </div>

            {/* Like */}
            <div
              className={`flex flex-row items-center gap-2 cursor-pointer transition hover:text-red-500 ${
                post?.hasLiked ? "text-red-500" : ""
              }`}
              onClick={onLike}
            >
              <FaHeart size={18} color={post?.hasLiked ? "red" : ""} />
              <p className="text-xs">{post?.likes || 0}</p>
            </div>

            {/* Bookmark */}
            <div
              className={`flex flex-row items-center gap-2 cursor-pointer transition hover:text-sky-500 ${
                post?.hasBookmarked ? "text-sky-500" : ""
              }`}
              onClick={onBookmark}
            >
              <Bookmark
                size={18}
                className={post?.hasBookmarked ? "fill-sky-500" : ""}
              />
            </div>

            {/* Share / Copy Link */}
            <div
              className="flex flex-row items-center gap-2 cursor-pointer transition hover:text-sky-500"
              onClick={onShare}
            >
              <Share2 size={18} />
            </div>

            {/* Delete button (only for post owner) */}
            {user?._id && post?.user?._id === user._id && (
              <div
                className="flex flex-row items-center cursor-pointer transition hover:text-red-500"
                onClick={onDelete}
              >
                <AiFillDelete size={19} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostItem;

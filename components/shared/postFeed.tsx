"use client";

import { IPost, IUser } from "@/types";
import { useEffect, useState } from "react";
import PostItem from "./postItem";
import PostSkeleton from "./postSkeleton";
import axios from "axios";

interface Props {
  userId: string;
  user: IUser;
}

const PostFeed = ({ userId, user }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<IPost[]>([]);
  const getPosts = async () => {
    try {
      setIsLoading(true);
      let { data } = await axios.get(`/api/users/posts/${userId}`);
      setPosts(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      getPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  return isLoading ? (
    <PostSkeleton count={3} />
  ) : posts.length === 0 ? (
    <div className="text-neutral-500 text-center p-8 text-base">
      Hozircha hech qanday post yo&apos;q
    </div>
  ) : (
    posts.map((post) => (
      <PostItem key={post._id} post={post} user={user} setPosts={setPosts} />
    ))
  );
};

export default PostFeed;

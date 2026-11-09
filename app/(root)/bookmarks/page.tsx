"use client";
import Header from "@/components/shared/header";
import PostItem from "@/components/shared/postItem";
import PostSkeleton from "@/components/shared/postSkeleton";
import { IPost } from "@/types";
import axios from "axios";
import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const BookmarksPage = () => {
  const { data: session, status }: any = useSession();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getBookmarks = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/bookmarks");
      setPosts(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBookmarks();
  }, []);

  return (
    <>
      <Header label="Bookmarks" isBack />
      {isLoading || status === "loading" ? (
        <PostSkeleton count={4} />
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
            <Bookmark className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Save posts for later
          </h3>
          <p className="text-neutral-500 max-w-sm">
            Don&apos;t let the good ones fly away! Bookmark posts to easily find
            them again in the future.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              user={
                session?.currentUser
                  ? JSON.parse(JSON.stringify(session.currentUser))
                  : null
              }
              setPosts={setPosts}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default BookmarksPage;

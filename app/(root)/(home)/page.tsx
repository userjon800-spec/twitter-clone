"use client";
import Form from "@/components/shared/form";
import Header from "@/components/shared/header";
import PostItem from "@/components/shared/postItem";
import PostSkeleton from "@/components/shared/postSkeleton";
import Buttons from "@/components/ui/buttons";
import { IPost } from "@/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const App = () => {
  let { data: session, status }: any = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getPosts = async () => {
    try {
      setIsLoading(true);
      let { data } = await axios.get("/api/posts?limit=10&page=1");
      setPosts(data);
      if (data.length < 10) {
        setHasMore(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore) return;
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      let { data } = await axios.get(`/api/posts?limit=10&page=${nextPage}`);
      if (data.length < 10) {
        setHasMore(false);
      }
      setPosts((prev) => [...prev, ...data]);
      setPage(nextPage);
      setIsLoadingMore(false);
    } catch (error) {
      console.error(error);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <Header label="Home" />
      <Form
        placeholder="What's on your mind ?"
        user={
          session?.currentUser
            ? JSON.parse(JSON.stringify(session.currentUser))
            : null
        }
        setPosts={setPosts}
      />
      {isLoading || status === "loading" ? (
        <PostSkeleton count={5} />
      ) : posts.length === 0 ? (
        <div className="text-neutral-500 text-center p-12 text-lg">
          Hozircha hech qanday post mavjud emas. Birinchi bo&apos;lib post
          qoldiring!
        </div>
      ) : (
        <>
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

          {hasMore && (
            <div className="p-4 flex justify-center">
              <Buttons
                label={isLoadingMore ? "Yuklanmoqda..." : "Yana ko'rsatish"}
                type="button"
                outline
                disabled={isLoadingMore}
                onClick={loadMorePosts}
                classNames="px-6 py-2"
              />
            </div>
          )}
        </>
      )}
    </>
  );
};
export default App;

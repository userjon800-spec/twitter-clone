"use client";
import Header from "@/components/shared/header";
import Buttons from "@/components/ui/buttons";
import useNotifications from "@/hooks/useNotifications";
import { IPost } from "@/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const params = useParams();
  const userId = params?.userId as string;
  let { data, isLoading, mutate } = useNotifications(userId);
  const [isClearing, setIsClearing] = useState(false);
  const onClear = async () => {
    try {
      if (!userId) return;
      setIsClearing(true);
      await axios.delete(`/api/notifications/${userId}`);
      mutate();
      setIsClearing(false);
    } catch (error) {
      console.error(error);
      setIsClearing(false);
    }
  };
  return (
    <>
      <Header isBack label="Notifications" />
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="flex flex-col">
          {data && data.length > 0 ? (
            data.map((notification: IPost) => (
              <div
                className="flex flex-row items-center p-6 gap-4 border-b-[1px] border-neutral-800"
                key={notification._id}
              >
                <Image
                  alt="logo"
                  src={"/images/x.svg"}
                  width={32}
                  height={32}
                />
                <p className="text-white">{notification.body}</p>
              </div>
            ))
          ) : (
            <div className="text-neutral-600 text-center p-6 text-xl">
              No notifications
            </div>
          )}

          {data && data?.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Buttons
                outline
                label={"Clear all"}
                onClick={onClear}
                type="button"
                disabled={isClearing}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default Page;

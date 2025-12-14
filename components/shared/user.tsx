"use client";
import { sliceText } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IUser } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Buttons from "../ui/buttons";
import { useState } from "react";
import axios from "axios";
interface Props {
  user: IUser;
  onChangeFollowing?: (user: IUser[]) => void;
  isFollow?: boolean;
  following?: IUser[];
}
const User = ({ user, onChangeFollowing, isFollow, following }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  let { data: session }: any = useSession();
  let router = useRouter();
  const onFollow = async () => {
    try {
      setIsLoading(true);
      await axios.put("/api/follows", {
        userId: user._id,
        currentUserId: session.currentUser._id,
      });
      let updatedFollowing = [...(following as IUser[]), user];
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onChangeFollowing && onChangeFollowing(updatedFollowing);
      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const onUnfollow = async () => {
    try {
      setIsLoading(true);
      await axios.delete("/api/follows", {
        data: {
          userId: user._id,
          currentUserId: session.currentUser._id,
        },
      });
      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-3 items-center justify-between cursor-pointer hover:bg-slate-300 hover:bg-opacity-10 transition py-2 px-3 rounded-md">
      <div className="flex gap-2 cursor-pointer">
        <Avatar>
          <AvatarImage src={user.profileImage} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-white font-semibold text-sm line-clamp-1">
            {user.name}
          </p>
          <p className="text-neutral-400 text-sm line-clamp-1">
            {user.username
              ? `@${sliceText(user.username, 16)}`
              : sliceText(user.email, 16)}
          </p>
        </div>
      </div>
      {isFollow && user._id !== session.currentUser?._id ? (
        user.followers.includes(session?.currentUser?._id) ? (
          <Buttons
            label={"Unfollow"}
            type="button"
            outline
            onClick={onUnfollow}
            disabled={isLoading}
            isLoading={isLoading}
          />
        ) : (
          <Buttons
            label={"Follow"}
            type="button"
            onClick={onFollow}
            disabled={isLoading}
            isLoading={isLoading}
          />
        )
      ) : null}
    </div>
  );
};
export default User;

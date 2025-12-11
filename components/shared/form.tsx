"use client";
import { IPost, IUser } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import Buttons from "../ui/buttons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
interface Props {
  placeholder: string;
  user: IUser;
  postId?: string;
  isComment?: boolean;
  setPosts: Dispatch<SetStateAction<IPost[]>>;
}
const Form = ({ placeholder, user, isComment, setPosts }: Props) => {
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let onSubmit = async () => {
    try {
      setIsLoading(true);
      let { data } = await axios.post("/api/posts", { body, userId: user._id });
      let newPost = {
  ...data,
  user: data.user ?? user, 
};
      setPosts(prew=> [newPost,...prew])
      setIsLoading(false);
      setBody("");
      toast({
        title: "Succes",
        description: "Post muaffaqiyatli yaratildi",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Nimadir xato ketdi, iltimos qayta urinib ko'ring",
        variant: "destructive",
      });
      setIsLoading(false);
    }
    
  };
  return (
    <div className="border-b-[1px] border-neutral-800 px-5 py-2">
      <div className="flex flex-row gap-4">
        <Avatar>
          <AvatarImage src={user?.profileImage} />
          <AvatarFallback>{user?.name[0]}</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <textarea
            className="disabled:opacity-80 peer resize-none mt-3 w-full bg-black ring-0 outline-none text-[20px] placeholder-neutral-500 text-white h-[50px]"
            placeholder={placeholder}
            disabled={isLoading}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          ></textarea>
          <hr className="opacity-0 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition" />

          <div className="mt-4 flex flex-row justify-end">
            <Buttons
              label={isComment ? "Reply" : "Post"}
              classNames="px-8"
              disabled={isLoading || !body}
              onClick={()=>onSubmit()}
              // isLoading={isLoading}
              type="submit"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;

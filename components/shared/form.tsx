"use client";
import { IPost, IUser } from "@/types";
import { Dispatch, SetStateAction, useState, useRef } from "react";
import Buttons from "../ui/buttons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface Props {
  placeholder: string;
  user: IUser;
  postId?: string;
  isComment?: boolean;
  setPosts: Dispatch<SetStateAction<IPost[]>>;
}
const Form = ({ placeholder, user, isComment, setPosts, postId }: Props) => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        return toast({
          title: "Fayl juda katta",
          description: "Rasm hajmi 4 MB dan oshmasligi kerak",
          variant: "destructive",
        });
      }
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  let onSubmit = async () => {
    if (!body.trim() && !image) return;
    try {
      setIsLoading(true);
      if (isComment) {
        let { data } = await axios.post("/api/comments", {
          body,
          postId,
        });
        let newComment = {
          ...data,
          user,
          likes: 0,
          hasLiked: false,
        };
        setPosts((prew) => [newComment, ...prew]);
      } else {
        let { data } = await axios.post("/api/posts", {
          body,
          image,
        });
        setPosts((prev) => [data, ...prev]);
        toast({
          title: "Muvaffaqiyatli",
          description: "Post yaratildi",
        });
      }
      setIsLoading(false);
      setBody("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
    <div className="border-b-[1px] border-neutral-800 px-5 py-3">
      <div className="flex flex-row gap-4">
        <Avatar>
          <AvatarImage src={user?.profileImage} />
          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <textarea
            className="disabled:opacity-80 peer resize-none mt-2 w-full bg-black ring-0 outline-none text-[19px] placeholder-neutral-500 text-white min-h-[60px]"
            placeholder={placeholder}
            disabled={isLoading}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if ((body.trim() || image) && !isLoading) onSubmit();
              }
            }}
          ></textarea>

          {/* Image preview */}
          {image && (
            <div className="relative mb-3 rounded-2xl overflow-hidden border border-neutral-800 max-h-[300px] w-full">
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition z-10"
              >
                <X size={18} />
              </button>
              <Image
                src={image}
                alt="Selected preview"
                width={500}
                height={300}
                className="w-full object-cover max-h-[300px]"
              />
            </div>
          )}

          <hr className="opacity-0 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition" />
          <div className="mt-3 flex flex-row justify-between items-center">
            {/* Image attachment icon (for posts) */}
            {!isComment ? (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  id="post-image-input"
                />
                <label
                  htmlFor="post-image-input"
                  className="p-2 rounded-full text-sky-500 hover:bg-sky-500/10 cursor-pointer flex items-center justify-center transition"
                  title="Rasm qo'shish"
                >
                  <ImageIcon size={20} />
                </label>
              </div>
            ) : (
              <div />
            )}

            <Buttons
              label={isComment ? "Reply" : "Post"}
              classNames="px-7"
              disabled={isLoading || (!body.trim() && !image)}
              onClick={() => onSubmit()}
              type="submit"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Form;

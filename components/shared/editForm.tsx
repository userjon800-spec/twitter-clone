"use client";

import { IUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Buttons from "../ui/buttons";
import axios from "axios";
import { useRouter } from "next/navigation";
import useEditModal from "@/hooks/useEditModal";
import { userSchema } from "@/lib/validation";
import { Textarea } from "../ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface Props {
  user: IUser;
}
const EditForm = ({ user }: Props) => {
  const router = useRouter();
  const editModal = useEditModal();
  let form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || "",
      location: user.location || "",
    },
  });
  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      await axios.put(`/api/users/${user._id}?type=updateFields`, values);
      router.refresh();
      editModal.onClose();
    } catch (error: any) {
      if (error.response.data.error) {
        return toast({
          title: "Error",
          description: error.response.data.error,
          variant: "destructive",
        });
      } else {
        return toast({
          title: "Error",
          description: "Nimadir xato ketdi, iltimos keyinroq urinib ko'ring",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 relative -top-8 mx-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Bio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Buttons
          type="submit"
          label={"Save"}
          secondary
          large
          fullWidhth
          //   disabled={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default EditForm;

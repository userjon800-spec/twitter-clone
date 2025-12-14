"use client";

// import useEditModal from '@/hooks/useEditModal'
import { IUser } from "@/types";
import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import useEditModal from "@/hooks/useEditModal";
import CoverImageUpload from "../shared/cover-image-upload";
import ProfileImageUpload from "../shared/profile-image-upload";
import axios from "axios";
import EditForm from "../shared/editForm";
// import EditForm from '../shared/edit-form'
// import useAction from '@/hooks/use-action'
// import { updateUser } from '@/actions/user.action'

interface Props {
  user: IUser;
}
const EditModal = ({ user }: Props) => {
  // const { isLoading, onError, setIsLoading } = useAction()
  const [coverImage, setCoverImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    setCoverImage(user.coverImage);
    setProfileImage(user.profileImage);
  }, [user]);
  const editModal = useEditModal();
  let router = useRouter();
  let handleImageUpload = async (image: string, isProfileImage: boolean) => {
    try {
      setisLoading(true);
      await axios.put(`/api/users/${user._id}?type=updateImage`, {
        [isProfileImage ? "profileImage" : "coverImage"]: image,
      });
      router.refresh();
      setisLoading(false);
    } catch (error) {
      setisLoading(true);
    }
  };
  let bodyContent = (
    <>
      {isLoading && (
        <div className="absolute z-10 h-[300px] bg-black opacity-50 left-0 top-12 right-0 flex justify-center items-center">
          <Loader2 className="animate-spin text-sky-500" />
        </div>
      )}
      <CoverImageUpload
        coverImage={coverImage}
        onChange={(image) => handleImageUpload(image, false)}
      />
      <ProfileImageUpload
        profileImage={profileImage}
        onChange={(image) => handleImageUpload(image, true)}
      />
      <EditForm user={user} />
    </>
  );
  return (
    <Modal
      body={bodyContent}
      isOpen={editModal.isOpen}
      onClose={editModal.onClose}
      isEditing
      footer={<></>}
    />
  );
};

export default EditModal;

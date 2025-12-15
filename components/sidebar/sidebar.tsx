"use client";

import { Bell, Home, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SidebarItems from "./sidebarItems";
import SidebarPostButton from "./sidebarPostButton";
import SidebarAkkaunt from "./sidebarAkkaunt";
import { IUser } from "@/types";
const Sidebar = ({ user }: { user: IUser }) => {  
  let sidebarItems = [
    { label: "Home", path: "/", icon: Home },
    {
      label: "Notifications",
      path: `/notifications/${user?._id}`,
      icon: Bell,
      notification: user?.hasNewNotifications
    },
    {
      label: "Profile",
      path: `/profile/${user?._id}`,
      icon: User,
    },
    { label: "Explore", path: "/explore", icon: Search },
  ];
  return (
    <section className="sticky left-0 top-0 h-screen lg:w-[266px] w-fit flex flex-col justify-between py-4 pl-2">
      <div className="flex flex-col space-y-2">
        <div className="rounded-full h-14 w-14 p-4 flex items-center justify-center hover:bg-sky-300 hover:bg-opacity-10 cursor-pointer transition">
          <Image width={56} height={56} src={"/images/logo.svg"} alt="logo" />
        </div>
        {sidebarItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <SidebarItems {...item} />
          </Link>
        ))}
        <SidebarPostButton />
      </div>
      <SidebarAkkaunt user={user} />
    </section>
  );
};

export default Sidebar;

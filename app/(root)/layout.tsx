import Auth from "@/components/auth";
import { authOption } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const Layout = async ({ children }: Props) => {
  let session: any = await getServerSession(authOption);
  console.log(session);
  if (!session) {
    return (
      <div className="container h-screen mx-auto max-w-7xl">
        {" "}
        <Auth />{" "}
      </div>
    );
  }

  return <div>{children}</div>;
};

export default Layout;

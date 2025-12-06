import Image from "next/image";
import Button from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import "./style.css";

const Auth = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center h-screen">
      <Image
        src={"/images/x.svg"}
        alt="x logo"
        width={450}
        height={450}
        className="justify-self-center logo"
      />
      <div className="flex flex-col justify-center md:justify-between gap-6 h-full md:h-[70vh]">
        <div className="block md:hidden">
          <Image
            src={"/images/x.svg"}
            alt="x logo"
            width={50}
            height={50}
            className="justify-self-center"
          />
        </div>
        <h1 className="text-6xl font-bold">Happening now</h1>
        <div className="w-full md:w-[60%]">
          <h2 className="font-bold text-3xl mb-4">Join today.</h2>
          <div className="flex flex-col space-y-2">
            <Button
              label={
                <div className="flex gap-2 items-center justify-center">
                  <FcGoogle /> Sinup with google
                </div>
              }
              fullWidhth
              secondary
              type="button"
            />
            <Button
              label={
                <div className="flex gap-2 items-center justify-center">
                  <AiFillGithub /> Sinup with gitHub
                </div>
              }
              fullWidhth
              secondary
              type="button"
            />
            <div className="flex items-center justify-center">
              <div className="h-px bg-gray-700 w-1/2" />
              <p className="mx-4">or</p>
              <div className="h-px bg-gray-700 w-1/2" />
            </div>
            <Button label={"Create account"} fullWidhth type="button" />
            <div className="text-[10px] text-gray-400">
              By signing up, you agree to the{" "}
              <span className="text-sky-500">Terms of Service</span> and
              <span className="text-sky-500"> Privacy Policy</span>, including
              <span className="text-sky-500"> Cookie Use</span>.
            </div>
          </div>
        </div>
        <div className="w-full md:w-[60%]">
          <h3 className="font-medium text-xl mb-4">
            Already hava an account ?
          </h3>
          <Button label={"Sign in "} fullWidhth type="button" outline />
        </div>
      </div>
    </div>
  );
};

export default Auth;

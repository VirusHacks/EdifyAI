"use client";

import { Button } from "@/components/ui/button";
import ShinyButton from "@/components/ui/shiny-button";
import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const { user, isAuthenticated } = useKindeBrowserClient();
  console.log("hello")
  console.log(user)
  return (
    <div className="flex justify-between p-5 shadow-sm">
      <Image
        src={"/logo.png"}
        alt="logo"
        width={150}
        height={100}
        priority
        className="object-cover"
      />
      {!isAuthenticated ? (
        <Link href="/sign-up">
          <ShinyButton text="Sign Up" />
        </Link>
      ) : (
        <Link href="/course-dashboard">
          <Button> Dashboard</Button>
        </Link>
      )}
    </div>
  );
};

export default Header;

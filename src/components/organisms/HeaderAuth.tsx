"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import SaveAndExitButton from "../atoms/auth/SaveAndExitButton";

function HeaderAuth() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleClickHome = () => {
    router.push("/artisans");
  };
  return (
    <div className="flex flex-row justify-between p-4">
      <div onClick={handleClickHome} className="cursor-pointer flex items-center">
        <Image
          src="/logos/logo.png"
          alt="Logo"
          width={90}
          height={0}
          style={{ maxWidth: "213px", maxHeight: "80px" }}
        />
      </div>

      <SaveAndExitButton children={"Quitter"} onClick={handleClickHome} />
    </div>
  );
}

export default HeaderAuth;

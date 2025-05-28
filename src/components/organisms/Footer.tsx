import React from "react";
import Image from "next/image";

function Footer() {
  return (
    <div className="flex flex-row justify-center p-4  border-t-1 border-dvianeutral-50 mt-10">
      <div className="flex-1 flex flex-col gap-4">
        <Image
          src="/logos/logo.png"
          alt="Logo"
          width={120}
          height={0}
          style={{ maxWidth: "213px", maxHeight: "80px" }}
        />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <Image
          src="/logos/logo.png"
          alt="Logo"
          width={120}
          height={0}
          style={{ maxWidth: "213px", maxHeight: "80px" }}
        />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <Image
          src="/logos/logo.png"
          alt="Logo"
          width={120}
          height={0}
          style={{ maxWidth: "213px", maxHeight: "80px" }}
        />
      </div>
    </div>
  );
}

export default Footer;

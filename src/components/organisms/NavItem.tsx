"use client";
import { useRouter } from "next/navigation";

type NavItemProps = {
  title: string;
  path: string;
  isActive?: boolean;
  onClick?: () => void;
};

export function NavItem({
  title,
  path,
  isActive = false,
  onClick,
}: NavItemProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(path);
        if (onClick) onClick(); 
      }}
      className={`
        relative cursor-pointer
        group px-2 py-1
        text-sm font-medium
        ${
          isActive ? "text-dviaprimary-40 font-semibold" : "text-dvianeutral-10"
        }
        hover:text-dviaprimary-50
      `}
    >
      <span>{title}</span>
    </div>
  );
}

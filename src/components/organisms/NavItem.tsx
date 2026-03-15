"use client";
import { useRouter } from "next/navigation";

type NavItemProps = {
  title: string;
  path: string;
  isActive?: boolean;
  onClick?: () => void | boolean | Promise<void | boolean>;
  icon?: React.ReactNode;
  className?: string;
};

export function NavItem({
  title,
  path,
  isActive = false,
  onClick,
  icon,
  className,
}: NavItemProps) {
  const router = useRouter();

  return (
    <div
      onClick={async () => {
        const clickResult = onClick ? await onClick() : true;
        if (clickResult !== false) {
          router.push(path);
        }
      }}
      className={`
        flex flex-row items-center gap-2 relative 
        group cursor-pointer px-2 py-1
        text-sm font-normal
        ${
          isActive ? "text-dviaprimary-40" : "text-dvianeutral-10"
        }
        ${className}
        hover:text-dviaprimary-50
      `}
    >
      {icon && <span>{icon}</span>}
      <span>{title}</span>
    </div>
  );
}

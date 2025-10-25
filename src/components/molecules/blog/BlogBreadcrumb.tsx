import Link from "next/link";

interface BlogBreadcrumbProps {
  title: string;
}

export default function BlogBreadcrumb({ title }: BlogBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <Link
        href="/"
        className="text-dviaprimary-40 hover:text-dviasecondary-40 transition-colors"
      >
        Accueil
      </Link>
      <span className="text-dvianeutral-50">/</span>
      <Link
        href="/blog"
        className="text-dviasecondary-40 hover:text-dvianeutral-40 transition-colors"
      >
        Blog
      </Link>
      <span className="text-dvianeutral-50">/</span>
      <span className="text-dvianeutral-10 font-medium truncate max-w-xs">
        {title}
      </span>
    </nav>
  );
}

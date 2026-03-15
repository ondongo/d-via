import Link from "next/link";

interface BlogBreadcrumbProps {
  title: string;
  homeHref?: string;
  blogHref?: string;
  homeLabel?: string;
  blogLabel?: string;
}

export default function BlogBreadcrumb({
  title,
  homeHref = "/",
  blogHref = "/blog",
  homeLabel = "Accueil",
  blogLabel = "Blog",
}: BlogBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <Link
        href={homeHref}
        className="text-dviaprimary-40 hover:text-dviasecondary-40 transition-colors"
      >
        {homeLabel}
      </Link>
      <span className="text-dvianeutral-50">/</span>
      <Link
        href={blogHref}
        className="text-dviasecondary-40 hover:text-dvianeutral-40 transition-colors"
      >
        {blogLabel}
      </Link>
      <span className="text-dvianeutral-50">/</span>
      <span className="text-dvianeutral-10 font-medium truncate max-w-xs">
        {title}
      </span>
    </nav>
  );
}

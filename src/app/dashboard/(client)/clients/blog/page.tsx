import { prisma } from "@/configs/prisma/prisma";
import BlogPageClient from "@/components/molecules/blog/BlogPageClient";

export default async function DashboardBlogPage() {
  const posts = await prisma.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      reactions: true,
    },
  });

  const allCategories = Array.from(new Set(posts.flatMap((post) => post.tags || [])));

  return (
    <div className="w-full px-4 md:px-6 pt-6 pb-8">
      <BlogPageClient
        posts={posts}
        categories={allCategories}
        basePath="/dashboard/clients/blog"
      />
    </div>
  );
}

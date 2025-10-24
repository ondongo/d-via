import { prisma } from "@/configs/prisma/prisma";
import BlogCard from "@/components/molecules/blog/BlogCard";
import BlogHeader from "@/components/molecules/blog/BlogHeader";
import CategoryStickyCard from "@/components/molecules/blog/CategoryStickyCard";
import BlogPageClient from "@/components/molecules/blog/BlogPageClient";

export default async function BlogPage() {
  const posts = await prisma.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      reactions: true,
    },
  });

  // Extraire toutes les catégories uniques des tags
  const allCategories = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  );

  return (
    <div className="min-h-screen ">
      <BlogHeader />
      <div className=" mx-auto px-6 py-8">
        <BlogPageClient posts={posts} categories={allCategories} />
      </div>
    </div>
  );
}

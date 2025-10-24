"use client";

import { useState, useMemo } from "react";
import BlogCard from "@/components/molecules/blog/BlogCard";
import CategoryStickyCard from "@/components/molecules/blog/CategoryStickyCard";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  previewImage?: string | null;
  author?: string | null;
  tags?: string[];
  createdAt: Date;
  reactions: Array<{
    id: string;
    type: string;
    count: number;
  }>;
}

interface BlogPageClientProps {
  posts: BlogPost[];
  categories: string[];
}

export default function BlogPageClient({
  posts,
  categories,
}: BlogPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "Tous") {
      return posts;
    }
    return posts.filter((post) => post.tags?.includes(selectedCategory));
  }, [posts, selectedCategory]);

  return (
    <div className="flex gap-4 flex-col lg:flex-row justify-center">
      {/* Contenu principal */}
      <div className="w-full flex items-center justify-center justify-items-center">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-dvianeutral-90 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-dvianeutral-60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-dvianeutral-30 mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-dvianeutral-50">
              Aucun article ne correspond à cette catégorie.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-8 ">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
      {/* Sidebar avec catégories */}
      <div className="hidden lg:block w-[350px] flex-shrink-0">
        <div className="sticky top-24">
          <CategoryStickyCard
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>
    </div>
  );
}

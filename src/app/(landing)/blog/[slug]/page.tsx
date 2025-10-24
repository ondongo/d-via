import { prisma } from "@/configs/prisma/prisma";
import { notFound } from "next/navigation";
import BlogPostContent from "@/components/molecules/blog/BlogPostContent";
import BlogPostHeader from "@/components/molecules/blog/BlogPostHeader";
import BlogPostFooter from "@/components/molecules/blog/BlogPostFooter";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await prisma.blog.findMany({
    select: {
      slug: true,
    },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.blog.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      reactions: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dvianeutral-98">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <BlogPostHeader post={post} />
        
        <div className="bg-white rounded-2xl shadow-sm border border-dvianeutral-90 p-8 md:p-12">
          <BlogPostContent content={post.content} />
        </div>
        
        <BlogPostFooter post={post} />
      </div>
    </div>
  );
}

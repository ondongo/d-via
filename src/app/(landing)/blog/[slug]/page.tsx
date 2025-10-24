import { prisma } from "@/configs/prisma/prisma";
import { notFound } from "next/navigation";
import BlogPostContent from "@/components/molecules/blog/BlogPostContent";
import BlogPostHeader from "@/components/molecules/blog/BlogPostHeader";
import BlogPostFooter from "@/components/molecules/blog/BlogPostFooter";
import BlogBreadcrumb from "@/components/molecules/blog/BlogBreadcrumb";
import TableOfContentsStickyCard from "@/components/molecules/blog/TableOfContentsStickyCard";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
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
  const { slug } = await params;
  
  const post = await prisma.blog.findUnique({
    where: {
      slug: slug,
    },
    include: {
      reactions: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-6 py-12">
        <BlogBreadcrumb title={post.title} />
        
        <div className="flex gap-8">
          {/* Sidebar avec table des matières */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <TableOfContentsStickyCard content={post.content} />
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            <BlogPostHeader post={post} />
            
            <div className="bg-white rounded-2xl shadow-sm border border-dvianeutral-90 p-8 md:p-12">
              <BlogPostContent content={post.content} />
            </div>
            
            <BlogPostFooter post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}

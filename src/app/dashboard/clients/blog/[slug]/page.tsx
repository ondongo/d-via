import { prisma } from "@/configs/prisma/prisma";
import { notFound } from "next/navigation";
import BlogPostContent from "@/components/molecules/blog/BlogPostContent";
import BlogPostHeader from "@/components/molecules/blog/BlogPostHeader";
import BlogPostFooter from "@/components/molecules/blog/BlogPostFooter";
import BlogBreadcrumb from "@/components/molecules/blog/BlogBreadcrumb";
import TableOfContentsStickyCard from "@/components/molecules/blog/TableOfContentsStickyCard";

interface DashboardBlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DashboardBlogPostPage({ params }: DashboardBlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.blog.findUnique({
    where: {
      slug,
    },
    include: {
      reactions: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full px-4 md:px-6 pb-8">
      <BlogBreadcrumb
        title={post.title}
        homeHref="/dashboard/clients"
        homeLabel="Dashboard"
        blogHref="/dashboard/clients/blog"
        blogLabel="Blog"
      />

      <div className="flex gap-8">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <TableOfContentsStickyCard content={post.content} />
          </div>
        </div>

        <div className="flex-1">
          <BlogPostHeader post={post} />

          <div className="bg-white rounded-2xl shadow-sm border border-dvianeutral-90 p-8 md:p-12">
            <BlogPostContent content={post.content} />
          </div>

          <BlogPostFooter post={post} />
        </div>
      </div>
    </div>
  );
}

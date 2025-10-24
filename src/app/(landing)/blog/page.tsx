import { prisma } from "@/configs/prisma/prisma";
import BlogCard from "@/components/molecules/blog/BlogCard";
import BlogHeader from "@/components/molecules/blog/BlogHeader";

export default async function BlogPage() {
  const posts = await prisma.blog.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      reactions: true
    }
  });

  return (
    <div className="min-h-screen bg-dvianeutral-98">
      <BlogHeader />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dvianeutral-10 mb-4">
            Blog D-Via
          </h1>
          <p className="text-lg text-dvianeutral-40 max-w-2xl">
            Découvrez nos derniers articles sur l'analyse de devis, 
            les conseils pour les artisans et les actualités du secteur.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-dvianeutral-90 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-dvianeutral-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-dvianeutral-30 mb-2">
              Aucun article pour le moment
            </h3>
            <p className="text-dvianeutral-50">
              Revenez bientôt pour découvrir nos premiers articles !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

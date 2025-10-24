import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    createdAt: Date;
    reactions: Array<{
      id: string;
      type: string;
      count: number;
    }>;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const totalReactions = post.reactions.reduce((sum, reaction) => sum + (reaction.count || 0), 0);
  const excerpt = post.content.length > 150 
    ? post.content.substring(0, 150) + "..." 
    : post.content;

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="bg-white rounded-2xl shadow-sm border border-dvianeutral-90 overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:border-dviaprimary-20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <time className="text-sm text-dvianeutral-50">
              {format(new Date(post.createdAt), "d MMMM yyyy", { locale: fr })}
            </time>
            {totalReactions > 0 && (
              <div className="flex items-center gap-1 text-dvianeutral-50">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 0012 18.334V7.666a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 006 10.333z" />
                </svg>
                <span className="text-sm">{totalReactions}</span>
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-dvianeutral-10 mb-3 group-hover:text-dviaprimary-40 transition-colors line-clamp-2">
            {post.title}
          </h2>
          
          <p className="text-dvianeutral-40 line-clamp-3 mb-4">
            {excerpt}
          </p>
          
          <div className="flex items-center text-dviaprimary-40 font-medium group-hover:text-dviaprimary-30 transition-colors">
            <span className="text-sm">Lire l'article</span>
            <svg 
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

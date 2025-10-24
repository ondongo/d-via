import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BlogPostHeaderProps {
  post: {
    id: string;
    title: string;
    slug: string;
    author?: string;
    featuredImage?: string;
    createdAt: Date;
    reactions: Array<{
      id: string;
      type: string;
      count: number;
    }>;
  };
}

export default function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const totalReactions = post.reactions.reduce((sum, reaction) => sum + (reaction.count || 0), 0);

  return (
    <div className="mb-8">
      {/* Image en grand */}
      {post.featuredImage && (
        <div className="mb-8">
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-dvianeutral-10 mb-6 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center justify-center gap-6 text-dviaprimary-40">
          {post.author && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">{post.author}</span>
            </div>
          )}
          
          <time className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{format(new Date(post.createdAt), "d MMMM yyyy", { locale: fr })}</span>
          </time>
          
          {totalReactions > 0 && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 0012 18.334V7.666a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 006 10.333z" />
              </svg>
              <span>{totalReactions} réaction{totalReactions > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

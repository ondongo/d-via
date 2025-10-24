"use client";
import { useState } from "react";
import { prisma } from "@/configs/prisma/prisma";

interface BlogPostFooterProps {
  post: {
    id: string;
    title: string;
    slug: string;
    reactions: Array<{
      id: string;
      type: string;
      count: number;
    }>;
  };
}

export default function BlogPostFooter({ post }: BlogPostFooterProps) {
  const [reactions, setReactions] = useState(post.reactions);
  const [isReacting, setIsReacting] = useState(false);

  const handleReaction = async (type: string) => {
    if (isReacting) return;
    
    setIsReacting(true);
    try {
      const response = await fetch('/api/blog/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId: post.id,
          type,
          sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReactions(data.reactions);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réaction:', error);
    } finally {
      setIsReacting(false);
    }
  };

  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'CLAPPING':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 0012 18.334V7.666a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 006 10.333z" />
          </svg>
        );
      case 'THINKING':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
        );
      case 'AMAZED':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getReactionLabel = (type: string) => {
    switch (type) {
      case 'CLAPPING':
        return 'Applaudir';
      case 'THINKING':
        return 'Intéressant';
      case 'AMAZED':
        return 'Impressionné';
      default:
        return type;
    }
  };

  return (
    <div className="mt-12">
      <div className="bg-white rounded-2xl shadow-sm border border-dvianeutral-90 p-6">
        <h3 className="text-lg font-semibold text-dvianeutral-10 mb-4">
          Que pensez-vous de cet article ?
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {['CLAPPING', 'THINKING', 'AMAZED'].map((type) => {
            const reaction = reactions.find(r => r.type === type);
            const count = reaction?.count || 0;
            
            return (
              <button
                key={type}
                onClick={() => handleReaction(type)}
                disabled={isReacting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dvianeutral-90 hover:border-dviaprimary-40 hover:bg-dviaprimary-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getReactionIcon(type)}
                <span className="text-sm font-medium text-dvianeutral-40">
                  {getReactionLabel(type)}
                </span>
                {count > 0 && (
                  <span className="text-xs bg-dvianeutral-90 text-dvianeutral-50 px-2 py-1 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 pt-6 border-t border-dvianeutral-90">
          <p className="text-sm text-dvianeutral-50">
            Merci pour votre retour ! Vos réactions nous aident à améliorer notre contenu.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { prisma } from "@/configs/prisma/prisma";
import EmojiReaction from "./EmojiReaction";

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

  const getReactionConfig = (type: string) => {
    switch (type) {
      case 'CLAPPING':
        return {
          title: 'Applaudir',
          defaultImage: '/emojis/clapping-hands.png',
          animatedImage: '/emojis/clapping-hands-animated.png',
          disabledImage: '/emojis/clapping-hands.png'
        };
      case 'THINKING':
        return {
          title: 'Intéressant',
          defaultImage: '/emojis/face-with-monocle.png',
          animatedImage: '/emojis/face-with-monocle-animated.png',
          disabledImage: '/emojis/face-with-monocle.png'
        };
      case 'AMAZED':
        return {
          title: 'Impressionné',
          defaultImage: '/emojis/astonished-face.png',
          animatedImage: '/emojis/astonished-face-animated.png',
          disabledImage: '/emojis/astonished-face.png'
        };
      default:
        return {
          title: type,
          defaultImage: '/emojis/clapping-hands.png',
          animatedImage: '/emojis/clapping-hands-animated.png',
          disabledImage: '/emojis/clapping-hands.png'
        };
    }
  };

  return (
    <div className="mt-12">
      <div className="bg-white rounded-2xl shadow-sm border border-dvianeutral-90 p-6">
        <h3 className="text-lg font-semibold text-dvianeutral-10 mb-4">
          Que pensez-vous de cet article ?
        </h3>
        
        <div className="flex flex-wrap gap-4">
          {['CLAPPING', 'THINKING', 'AMAZED'].map((type) => {
            const reaction = reactions.find(r => r.type === type);
            const count = reaction?.count || 0;
            const config = getReactionConfig(type);
            
            return (
              <div key={type} className="flex flex-col items-center gap-2">
                <EmojiReaction
                  title={config.title}
                  defaultImage={config.defaultImage}
                  animatedImage={config.animatedImage}
                  disabledImage={config.disabledImage}
                  disabled={isReacting}
                  onClick={() => handleReaction(type)}
                />
                <div className="text-center">
                  <div className="text-xs font-medium text-dviaprimary-40">
                    {config.title}
                  </div>
                  {count > 0 && (
                    <div className="text-xs text-dviaprimary-40 font-semibold">
                      {count}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-6 border-t border-dvianeutral-90">
          <p className="text-sm text-dvianeutral-10">
            Merci pour votre retour ! Vos réactions nous aident à améliorer notre contenu.
          </p>
        </div>
      </div>
    </div>
  );
}

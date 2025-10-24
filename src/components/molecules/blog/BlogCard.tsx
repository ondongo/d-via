import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";

interface BlogCardProps {
  post: {
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
  };
}

// Composant de réaction plus petit pour les cartes
const SmallEmojiReaction = ({
  title,
  defaultImage,
  animatedImage,
  onClick,
}: {
  title: string;
  defaultImage: string;
  animatedImage: string;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick();
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <button
      title={title}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-6 h-6 flex items-center justify-center transition-transform duration-150 hover:scale-110 active:scale-95"
    >
      <img
        src={isHovered ? animatedImage : defaultImage}
        alt={title}
        className={`w-5 h-5 object-contain transition-all duration-150 ${
          isClicked ? "animate-bounce" : ""
        }`}
      />
    </button>
  );
};

export default function BlogCard({ post }: BlogCardProps) {
  const totalReactions = post.reactions.reduce(
    (sum, reaction) => sum + (reaction.count || 0),
    0
  );
  const displayExcerpt =
    post.excerpt ||
    (post.content.length > 120
      ? post.content.substring(0, 120) + "..."
      : post.content);

  const getReactionConfig = (type: string) => {
    switch (type) {
      case "CLAPPING":
        return {
          title: "Applaudir",
          defaultImage: "/emojis/clapping-hands.png",
          animatedImage: "/emojis/clapping-hands-animated.png",
          disabledImage: "/emojis/clapping-hands.png",
        };
      case "THINKING":
        return {
          title: "Intéressant",
          defaultImage: "/emojis/face-with-monocle.png",
          animatedImage: "/emojis/face-with-monocle-animated.png",
          disabledImage: "/emojis/face-with-monocle.png",
        };
      case "AMAZED":
        return {
          title: "Impressionné",
          defaultImage: "/emojis/astonished-face.png",
          animatedImage: "/emojis/astonished-face-animated.png",
          disabledImage: "/emojis/astonished-face.png",
        };
      default:
        return {
          title: type,
          defaultImage: "/emojis/clapping-hands.png",
          animatedImage: "/emojis/clapping-hands-animated.png",
          disabledImage: "/emojis/clapping-hands.png",
        };
    }
  };

  const handleReaction = async (type: string) => {
    try {
      const response = await fetch("/api/blog/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentId: post.id,
          type,
          sessionId: `session_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        }),
      });

      if (response.ok) {
        // Optionnel: mettre à jour l'état local ou recharger la page
        console.log("Réaction ajoutée avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réaction:", error);
    }
  };

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="border border-dvianeutral-50 rounded-2xl px-4 w-full md:max-w-xs min-h-[480px] bg-dvianeutral-96 hover:hover:border-dvianeutral-50 transition-all duration-300">
        {/* Header avec auteur */}
        <div className="flex items-center justify-between py-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-dviaprimary-90 flex items-center justify-center text-dviaprimary-10 font-semibold">
              {post.author ? post.author.charAt(0).toUpperCase() : "D"}
            </div>
            <div>
              <div className="text-sm text-dvianeutral-10 font-medium">
                {post.author || "Équipe D-Via"}
              </div>
              <div className="text-xs text-dvianeutral-40 max-w-[150px] truncate overflow-hidden whitespace-nowrap">
                {format(new Date(post.createdAt), "d MMM yyyy", { locale: fr })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {["CLAPPING", "THINKING", "AMAZED"].map((type) => {
              const reaction = post.reactions.find((r) => r.type === type);
              const count = reaction?.count || 0;
              const config = getReactionConfig(type);

              return (
                <div key={type} className="flex flex-col items-center gap-1">
                  <SmallEmojiReaction
                    title={config.title}
                    defaultImage={config.defaultImage}
                    animatedImage={config.animatedImage}
                    onClick={() => handleReaction(type)}
                  />
                  {count > 0 && (
                    <span className="text-xs text-dviaprimary-40 text-center leading-none">
                      {count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Image principale */}
        {(post.featuredImage || post.previewImage) && (
          <img
            src={post.featuredImage || post.previewImage || ""}
            alt={post.title}
            className="rounded-xl mb-3 h-40 w-full object-cover"
          />
        )}

        {/* Titre */}
        <h2 className="text-lg line-clamp-1 font-bold text-dvianeutral-10 mb-3 group-hover:text-dviaprimary-40 transition-colors">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-dvianeutral-10 line-clamp-2 mb-4">
          {displayExcerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="border border-dvianeutral-50 text-xs px-2 py-1 rounded bg-dvianeutral-94 text-dvianeutral-30"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-dvianeutral-40 px-2 py-1">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bouton d'action */}
        <div className="flex flex-row gap-2 mt-auto">
          <button className="w-full border border-dvianeutral-50 text-dviaprimary-40 text-sm py-2 rounded flex flex-row gap-2 justify-center items-center px-4 cursor-pointer hover:bg-dviaprimary-90 hover:border-dvianeutral-50 transition-colors ">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            Lire l'article
          </button>
        </div>
      </article>
    </Link>
  );
}

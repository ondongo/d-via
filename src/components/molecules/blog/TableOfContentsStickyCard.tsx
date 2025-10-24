"use client";

import { useEffect, useState } from "react";

interface TableOfContentsStickyCardProps {
  content: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContentsStickyCard({
  content,
}: TableOfContentsStickyCardProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extraire les titres du contenu Markdown
  useEffect(() => {
    const headings = content.match(/^#{1,6}\s+(.+)$/gm);
    if (headings) {
      const items: TocItem[] = headings.map((heading, index) => {
        const level = heading.match(/^#+/)?.[0].length || 1;
        const text = heading.replace(/^#+\s+/, "");
        const id = `heading-${index}`;
        return { id, text, level };
      });
      setTocItems(items);
    }
  }, [content]);

  // Observer pour détecter la section active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Trouver l'élément le plus proche du haut de la fenêtre
        let closestElement = null;
        let closestDistance = Infinity;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            const distance = Math.abs(rect.top);
            
            if (distance < closestDistance) {
              closestDistance = distance;
              closestElement = entry.target;
            }
          }
        });

        if (closestElement) {
          setActiveId(closestElement.id);
        }
      },
      { 
        rootMargin: "-10% 0% -70% 0%",
        threshold: [0, 0.1, 0.5, 1]
      }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-4 bg-dvianeutral-96 border border-dvianeutral-50 rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-dvianeutral-10 mb-3">
        Table des matières
      </h3>
      <nav className="space-y-1">
        {tocItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(item.id);
              if (element) {
                element.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                  inline: 'nearest'
                });
              }
            }}
            className={`block text-xs py-1 px-2 rounded transition-colors cursor-pointer ${
              activeId === item.id
                ? "bg-dviaprimary-90 text-dviaprimary-40 border-l-2 border-dviaprimary-40"
                : "text-dvianeutral-30 hover:bg-dvianeutral-90 hover:text-dvianeutral-10"
            }`}
            style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}

"use client";
import { MDXRemote } from 'next-mdx-remote/rsc';
import { useMemo } from 'react';

interface BlogPostContentProps {
  content: string;
}

// Fonction pour générer un ID à partir du texte
const generateId = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Compteur pour les IDs uniques
let headingCounter = 0;

const components = {
  h1: ({ children, ...props }: any) => {
    const text = typeof children === 'string' ? children : children?.toString() || '';
    const id = `heading-${headingCounter++}`;
    return (
      <h1 
        id={id}
        className="text-3xl font-bold text-dviaprimary-40 mb-6 mt-8 first:mt-0" 
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }: any) => {
    const text = typeof children === 'string' ? children : children?.toString() || '';
    const id = `heading-${headingCounter++}`;
    return (
      <h2 
        id={id}
        className="text-2xl font-bold text-dvianeutral-10 mb-4 mt-6" 
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: any) => {
    const text = typeof children === 'string' ? children : children?.toString() || '';
    const id = `heading-${headingCounter++}`;
    return (
      <h3 
        id={id}
        className="text-xl font-semibold text-dvianeutral-10 mb-3 mt-5" 
        {...props}
      >
        {children}
      </h3>
    );
  },
  p: ({ children, ...props }: any) => (
    <p className="text-dvianeutralvariant-30 text-[14px] md:text-[16px] leading-title-small tracking-title-small font-[400]" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside text-dvianeutralvariant-30 mb-4 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside text-dvianeutralvariant-30 mb-4 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="ml-4" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote 
      className="border-l-4 border-dviaprimary-40 pl-6 py-2 my-6 bg-dvianeutral-96 italic text-dvianeutral-30" 
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }: any) => (
    <code 
      className="bg-dvianeutral-90 text-dviaprimary-40 px-2 py-1 rounded text-sm font-mono" 
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }: any) => (
    <div className="my-6">
      <pre 
        className="bg-dvianeutral-95 rounded-lg p-4 overflow-x-auto" 
        {...props}
      >
        {children}
      </pre>
    </div>
  ),
  a: ({ children, href, ...props }: any) => (
    <a 
      href={href}
      className="text-dviaprimary-40 hover:text-dviaprimary-30 underline transition-colors" 
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  img: ({ src, alt, ...props }: any) => (
    <div className="my-6">
      <img 
        src={src}
        alt={alt}
        className="w-full h-auto rounded-lg shadow-sm" 
        {...props}
      />
    </div>
  ),
  hr: ({ ...props }: any) => (
    <hr className="border-dvianeutral-90 my-8" {...props} />
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border border-dvianeutral-90 rounded-lg" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th className="bg-dvianeutral-96 px-4 py-3 text-left text-sm font-semibold text-dvianeutral-10 border-b border-dvianeutral-90" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-4 py-3 text-sm text-dvianeutralvariant-30 border-b border-dvianeutral-90" {...props}>
      {children}
    </td>
  ),
};

export default function BlogPostContent({ content }: BlogPostContentProps) {
  // Réinitialiser le compteur à chaque rendu
  headingCounter = 0;
  
  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote 
        source={content} 
        components={components}
      />
    </div>
  );
}

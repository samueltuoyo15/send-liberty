"use client";

import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function SEO({ title, description, children }: SEOProps) {
  useEffect(() => {
    document.title = `${title} | SendLib`;
    
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      } else {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        meta.setAttribute("content", description);
        document.head.appendChild(meta);
      }
    }
  }, [title, description]);

  return <>{children}</>;
}

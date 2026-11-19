import { useEffect } from 'react';

interface PageMetaOptions {
  title: string;
  description: string;
}

export function usePageMeta({ title, description }: PageMetaOptions): void {
  useEffect(() => {
    document.title = title;

    const updateMeta = (selector: string, attrName: 'name' | 'property', attrVal: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrVal);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMeta('meta[name="description"]', 'name', 'description', description);
    updateMeta('meta[property="og:title"]', 'property', 'og:title', title);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', description);
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  }, [title, description]);
}

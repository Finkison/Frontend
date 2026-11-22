import { useEffect } from "react";

function setMetaContent(selector: string, attribute: string, value: string): void {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement("meta");
    const match = selector.match(/\[(name|property)="([^"]+)"\]/);
    if (match) meta.setAttribute(match[1], match[2]);
    document.head.appendChild(meta);
  }
  meta.setAttribute(attribute, value);
}

export function usePageMeta(title: string, description?: string): void {
  useEffect(() => {
    const includesBrand = /\bFinkison\b|ፊንኪሰን/i.test(title);
    const fullTitle = includesBrand ? title : `${title} | Finkison`;
    document.title = fullTitle;
    setMetaContent('meta[property="og:title"]', "content", fullTitle);
    setMetaContent('meta[name="twitter:title"]', "content", fullTitle);
    setMetaContent('meta[name="twitter:card"]', "content", "summary_large_image");
    setMetaContent('meta[property="og:url"]', "content", `${window.location.origin}${window.location.pathname}`);

    if (description) {
      setMetaContent('meta[name="description"]', "content", description);
      setMetaContent('meta[property="og:description"]', "content", description);
      setMetaContent('meta[name="twitter:description"]', "content", description);
    }
  }, [title, description]);
}

export default usePageMeta;

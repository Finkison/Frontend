import React from "react";

interface MathTextProps {
  text: string;
  className?: string;
}

export default function MathText({ text, className = "" }: MathTextProps): React.ReactElement {
  if (!text) return <span className={className}></span>;

  const tokens = text.split(/(\s+)/);

  const formattedTokens = tokens.map((token, i) => {
    if (token.includes("^") || token.includes("_")) {
      const parts = token.split(/(\^[a-zA-Z0-9\-]+|_[a-zA-Z0-9\-]+)/g);
      return (
        <span key={i} className="inline-block">
          {parts.map((part, pIdx) => {
            if (part.startsWith("^")) {
              return (
                <sup key={pIdx} className="text-[0.7em] font-serif font-bold text-amber-700">
                  {part.slice(1)}
                </sup>
              );
            }
            if (part.startsWith("_")) {
              return (
                <sub key={pIdx} className="text-[0.7em] font-serif font-bold text-slate-700">
                  {part.slice(1)}
                </sub>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </span>
      );
    }

    return <span key={i}>{token}</span>;
  });

  return <span className={className}>{formattedTokens}</span>;
}

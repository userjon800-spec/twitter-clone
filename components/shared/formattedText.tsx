"use client";
import Link from "next/link";
import React from "react";

interface Props {
  text: string;
  className?: string;
}

export const FormattedText = ({ text, className }: Props) => {
  if (!text) return null;

  // Regex matches #hashtags, @mentions, or urls
  const regex = /((?:#|@)[a-zA-Z0-9_]+|https?:\/\/[^\s]+)/g;
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("#")) {
          return (
            <Link
              key={index}
              href={`/explore`}
              onClick={(e) => e.stopPropagation()}
              className="text-sky-500 hover:underline cursor-pointer"
            >
              {part}
            </Link>
          );
        } else if (part.startsWith("@")) {
          const username = part.slice(1);
          return (
            <Link
              key={index}
              href={`/explore`}
              onClick={(e) => e.stopPropagation()}
              className="text-sky-500 hover:underline cursor-pointer"
            >
              {part}
            </Link>
          );
        } else if (part.startsWith("http://") || part.startsWith("https://")) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-sky-500 hover:underline break-all"
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </span>
  );
};
export default FormattedText;

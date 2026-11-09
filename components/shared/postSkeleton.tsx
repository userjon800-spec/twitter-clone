"use client";
import React from "react";

interface Props {
  count?: number;
}

export const PostSkeleton = ({ count = 3 }: Props) => {
  return (
    <div className="flex flex-col divide-y divide-neutral-800">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-5 flex gap-3 animate-pulse">
          {/* Avatar skeleton */}
          <div className="w-10 h-10 rounded-full bg-neutral-800 flex-shrink-0" />

          {/* Post content skeleton */}
          <div className="flex-1 space-y-3 pt-1">
            {/* Header: name and username */}
            <div className="flex items-center gap-2">
              <div className="h-4 bg-neutral-800 rounded w-28" />
              <div className="h-3 bg-neutral-800 rounded w-20" />
              <div className="h-3 bg-neutral-800 rounded w-12" />
            </div>

            {/* Body lines */}
            <div className="space-y-2">
              <div className="h-3 bg-neutral-800 rounded w-full" />
              <div className="h-3 bg-neutral-800 rounded w-3/4" />
            </div>

            {/* Action buttons placeholder */}
            <div className="flex items-center gap-12 pt-2">
              <div className="h-4 w-10 bg-neutral-800 rounded" />
              <div className="h-4 w-10 bg-neutral-800 rounded" />
              <div className="h-4 w-10 bg-neutral-800 rounded" />
              <div className="h-4 w-10 bg-neutral-800 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default PostSkeleton;

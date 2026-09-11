'use client';

import React from 'react';
import Image from 'next/image';

export default function ShareButtons() {
  return (
    <div className="flex items-center gap-4 text-gray-800">
      <button
        aria-label="Share on Facebook"
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
          }
        }}
        className="p-1 hover:opacity-75 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
      >
        <Image
          src="/images/facebook-share-icon.webp"
          alt=""
          width={26}
          height={26}
          className="w-6 h-6 object-contain"
        />
      </button>
      <button
        aria-label="Share on LinkedIn"
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
          }
        }}
        className="p-1 hover:opacity-75 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
      >
        <Image
          src="/images/linkedin-share-icon.webp"
          alt=""
          width={26}
          height={26}
          className="w-6 h-6 object-contain"
        />
      </button>
    </div>
  );
}

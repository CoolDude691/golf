import React from "react";
import { Share2, Facebook, Twitter, MessageCircle } from "lucide-react";

const ShareSection = ({ content }) => {
  const c = content;
  if (!c) return null;
  const url = typeof window !== "undefined" ? window.location.origin : "";
  const text = encodeURIComponent("Check out Mini Golf USA Directory - 4,000+ mini golf courses!");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center gap-3 mb-4">
        <Share2 className="w-6 h-6 text-emerald-500" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {c.shareTitle}
        </h2>
      </div>
      <p className="text-gray-600 max-w-xl">{c.shareText}</p>
      <div className="flex items-center gap-3 mt-5">
        <span className="flex items-center gap-1.5 text-sm text-gray-600">
          <Share2 className="w-4 h-4" /> Share:
        </span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
        >
          <Facebook className="w-4 h-4" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
        >
          <Twitter className="w-4 h-4" />
        </a>
        <a
          href={`https://wa.me/?text=${text}%20${url}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};

export default ShareSection;

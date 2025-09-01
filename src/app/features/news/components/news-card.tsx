"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SteamNewsItem,
  formatNewsDate,
  extractImageFromContent,
  cleanContentForDisplay,
} from "../api/steam-news";
import { ExternalLink, Calendar, User } from "lucide-react";
import Image from "next/image";

interface NewsCardProps {
  newsItem: SteamNewsItem;
}

export default function NewsCard({ newsItem }: NewsCardProps) {
  const handleClick = () => {
    window.open(newsItem.url, "_blank", "noopener,noreferrer");
  };

  const imageUrl = extractImageFromContent(newsItem.contents);
  const cleanContent = cleanContentForDisplay(newsItem.contents);

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-gray-800 border-gray-700 hover:border-gray-600 overflow-hidden">
      {imageUrl && (
        <div className="w-full bg-gray-900 overflow-hidden">
          <Image
            src={imageUrl}
            alt={newsItem.title}
            width={800}
            height={400}
            className="w-full h-auto object-contain hover:scale-105 transition-transform duration-200"
            sizes="100vw"
          />
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-white hover:text-red-400 transition-colors flex items-start justify-between gap-2">
          <span className="line-clamp-2">{newsItem.title}</span>
          <ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" />
        </CardTitle>
      </CardHeader>

      <CardContent onClick={handleClick}>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatNewsDate(newsItem.date)}</span>
            </div>
            {newsItem.author && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{newsItem.author}</span>
              </div>
            )}
          </div>

          <div className="text-gray-300 leading-relaxed line-clamp-6">
            {cleanContent}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-red-400 font-medium">
              {newsItem.feedlabel || "Dota 2 News"}
            </span>
            <span className="text-xs text-gray-500">Click to read more</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

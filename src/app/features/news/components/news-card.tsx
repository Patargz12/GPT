"use client";

import {
  SteamNewsItem,
  formatNewsDate,
  extractImageFromContent,
  cleanContentForDisplay,
} from "../api/steam-news";
import { ExternalLink, Calendar, User } from "lucide-react";
import Image from "next/image";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

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
    <div className="cursor-pointer" onClick={handleClick}>
      <CardContainer containerClassName="">
        <CardBody className="bg-gray-800 border border-gray-700 hover:border-gray-600 transition-shadow duration-200 overflow-hidden p-4 rounded-xl w-full max-w-xl h-auto min-h-0">
          <CardItem translateZ={60} className="w-full mb-4">
            <div className="w-full bg-gray-900 overflow-hidden rounded-xl">
              <Image
                src={imageUrl || "/empty_placeholder.jpg"}
                alt={newsItem.title}
                width={800}
                height={400}
                className="w-full h-60 object-cover hover:scale-105 transition-transform duration-200"
                sizes="100vw"
                priority={!!imageUrl}
              />
            </div>
          </CardItem>
          <CardItem
            translateZ={40}
            className="flex items-start justify-between gap-2 mb-2"
          >
            <span className="text-white font-semibold text-lg line-clamp-2 hover:text-red-400 transition-colors">
              {newsItem.title}
            </span>
            <ExternalLink className="w-4 h-4 flex-shrink-0 mt-1 text-gray-400" />
          </CardItem>
          <CardItem
            translateZ={30}
            className="flex items-center gap-4 text-sm text-gray-400 mb-2"
          >
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
          </CardItem>
          <CardItem
            translateZ={20}
            className="text-gray-300 leading-relaxed line-clamp-6 mb-3"
          >
            {cleanContent}
          </CardItem>
          <CardItem
            translateZ={10}
            className="flex items-center justify-between"
          >
            <span className="text-xs text-red-400 font-medium">
              {newsItem.feedlabel || "Dota 2 News"}
            </span>
            <span className="text-xs text-gray-500">Click to read more</span>
          </CardItem>
        </CardBody>
      </CardContainer>
    </div>
  );
}

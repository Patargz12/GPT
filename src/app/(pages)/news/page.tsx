"use client";

import { useState, useEffect } from "react";
import {
  SteamNewsItem,
  fetchDota2News,
} from "@/app/features/news/api/steam-news";
import NewsCard from "@/app/features/news/components/news-card";
import Navbar from "@/app/components/shared/navbar";
import { Loader2, AlertCircle, Newspaper } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<SteamNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        setError(null);
        const newsData = await fetchDota2News(12);
        setNews(newsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load news");
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 pt-20">
          <div className="container mx-auto px-6 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
                <p className="text-gray-400">Loading latest Dota 2 news...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 pt-20">
          <div className="container mx-auto px-6 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">
                  Failed to Load News
                </h2>
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Newspaper className="w-8 h-8 text-red-500" />
              <h1 className="text-4xl font-bold text-white">
                Dota 2 <span className="text-red-500">News</span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Stay updated with the latest Dota 2 news, updates, and
              announcements from Valve
            </p>
          </div>

          {/* News Grid */}
          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((newsItem) => (
                <NewsCard key={newsItem.gid} newsItem={newsItem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No news available at the moment.</p>
            </div>
          )}

          {/* Footer Note */}
          <div className="text-center mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              News powered by Steam Web API • Updates every 5 minutes
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

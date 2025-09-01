// Steam Web API integration for Dota 2 news
export interface SteamNewsItem {
    gid: string;
    title: string;
    url: string;
    is_external_url: boolean;
    author: string;
    contents: string;
    feedlabel: string;
    date: number;
    feedname: string;
    feed_type: number;
    appid: number;
}

export interface SteamNewsResponse {
    appnews: {
        appid: number;
        newsitems: SteamNewsItem[];
        count: number;
    };
}

export async function fetchDota2News(count: number = 10): Promise<SteamNewsItem[]> {
    try {
        const response = await fetch(`/api/news?count=${count}`, {
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data: SteamNewsResponse = await response.json();
        return data.appnews.newsitems || [];
    } catch (error) {
        console.error('Error fetching Dota 2 news:', error);
        throw new Error('Failed to fetch Dota 2 news');
    }
}

export function formatNewsDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function truncateContent(content: string, maxLength: number = 600): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
}

export function extractImageFromContent(content: string): string | null {
    // Extract Steam clan images from content
    const steamImageRegex = /\{STEAM_CLAN_IMAGE\}\/(\d+)\/([a-f0-9]+)\.(\w+)/i;
    const match = content.match(steamImageRegex);

    if (match) {
        const [, clanId, imageId, extension] = match;
        return `https://clan.akamai.steamstatic.com/images/${clanId}/${imageId}.${extension}`;
    }

    // Also try to extract regular image URLs
    const imgTagRegex = /<img[^>]+src="([^"]+)"/i;
    const imgMatch = content.match(imgTagRegex);

    if (imgMatch) {
        return imgMatch[1];
    }

    return null;
}

export function cleanContentForDisplay(content: string): string {
    // Remove Steam clan image placeholders and other unwanted content
    let cleaned = content.replace(/\{STEAM_CLAN_IMAGE\}\/\d+\/[a-f0-9]+\.\w+/gi, '');

    // Remove HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');

    // Clean up extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
}
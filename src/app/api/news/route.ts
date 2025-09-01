import { NextResponse } from 'next/server';

const DOTA2_APP_ID = 570;
const STEAM_NEWS_API = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const count = searchParams.get('count') || '10';

        const url = `${STEAM_NEWS_API}?appid=${DOTA2_APP_ID}&count=${count}&maxlength=1000&format=json`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'DotaGPT/1.0',
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error(`Steam API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Error fetching Dota 2 news:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Dota 2 news' },
            { status: 500 }
        );
    }
}
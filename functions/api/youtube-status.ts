
import { Env } from '../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);
    const videoId = url.searchParams.get('videoId');

    if (!videoId) {
        return new Response(JSON.stringify({ error: "Missing videoId" }), { status: 400 });
    }

    const apiKey = env.GOOGLE_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "Server missing Google API Key" }), { status: 500 });
    }

    try {
        const ytUrl = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,statistics,snippet&id=${videoId}&key=${apiKey}`;
        const res = await fetch(ytUrl);
        const data = await res.json();

        if (!data.items || data.items.length === 0) {
            return new Response(JSON.stringify({ error: "Video not found", raw: data }), { status: 404 });
        }

        const item = data.items[0];
        const stats = {
            title: item.snippet?.title,
            status: item.snippet?.liveBroadcastContent, // 'live', 'upcoming', 'none'
            viewers: item.liveStreamingDetails?.concurrentViewers || '0',
            likes: item.statistics?.likeCount || '0',
            startTime: item.liveStreamingDetails?.actualStartTime,
            scheduledTime: item.liveStreamingDetails?.scheduledStartTime
        };

        return new Response(JSON.stringify(stats), { headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};

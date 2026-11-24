import { RecentArt } from "@/data/recent";

interface InstagramMediaItem {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

interface InstagramApiResponse {
  data?: InstagramMediaItem[];
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

/**
 * Fetches recent posts from Instagram Basic Display / Instagram Login Graph API.
 * Reads INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID from process.env.
 * Filters to keep only IMAGE and CAROUSEL_ALBUM items.
 * Caches with fetch revalidation of 3600 seconds (1 hour).
 */
export async function getInstagramPosts(): Promise<RecentArt[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID || "me";

  if (!accessToken) {
    throw new Error("INSTAGRAM_ACCESS_TOKEN is not defined in environment variables");
  }

  const fields = "id,media_type,media_url,permalink,caption,timestamp";
  const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&access_token=${accessToken}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Instagram API request failed with status: ${response.status}`);
  }

  const json: InstagramApiResponse = await response.json();

  if (json.error || !Array.isArray(json.data)) {
    throw new Error(json.error?.message || "Invalid response format from Instagram API");
  }

  // Filter only IMAGE and CAROUSEL_ALBUM items with a valid media_url
  const eligibleItems = json.data.filter(
    (item) =>
      (item.media_type === "IMAGE" || item.media_type === "CAROUSEL_ALBUM") &&
      Boolean(item.media_url)
  );

  return eligibleItems.map((item) => {
    // Format timestamp to Month Year (e.g., October 2026)
    let formattedDate = "";
    try {
      const dateObj = new Date(item.timestamp);
      formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(dateObj);
    } catch {
      formattedDate = "Recent";
    }

    // Extract title from first line of caption
    const rawCaption = item.caption || "Recent capture";
    const title = rawCaption.split("\n")[0].slice(0, 60).trim();

    return {
      id: item.id,
      src: item.media_url as string,
      title: title || "Untitled Work",
      date: formattedDate,
      instagramUrl: item.permalink,
      width: 1440,
      height: 1080,
      alt: title || "Aswin Krishna recent art capture",
    };
  });
}

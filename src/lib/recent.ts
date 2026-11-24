import { RecentArt, recentArts as staticRecentArts } from "@/data/recent";
import { getInstagramPosts } from "./instagram";

/**
 * Access layer for Recent Arts data.
 * Currently returns static catalog items from src/data/recent.ts.
 * Prepared for future Instagram live feed replacement via getInstagramPosts() with graceful fallback.
 */
export async function getRecentArts(): Promise<RecentArt[]> {
  // Instagram source is prepared but not enabled yet per requirements.
  // When ready to switch, set ENABLE_INSTAGRAM_API=true in environment.
  const enableInstagram = process.env.ENABLE_INSTAGRAM_API === "true";

  if (enableInstagram) {
    try {
      const posts = await getInstagramPosts();
      if (posts && posts.length > 0) {
        return posts;
      }
    } catch (err) {
      console.warn("Instagram feed unavailable, falling back to static recent arts:", err);
    }
  }

  // Fallback to static data
  return staticRecentArts;
}

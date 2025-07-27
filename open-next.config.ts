import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Enable R2 cache for better performance with static assets
  // Uncomment when ready to use R2 for incremental static regeneration:
  // incrementalCache: r2IncrementalCache,
  
  // Note: Additional Cloudflare optimizations can be configured in wrangler.jsonc
  // This includes KV namespaces, D1 databases, and other Cloudflare services
});

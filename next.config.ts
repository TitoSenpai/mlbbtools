import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 15 Performance Optimizations
  // Note: Some features require canary version - uncomment when upgrading
  
  // experimental: {
  //   // Enable Partial Prerendering for static + dynamic content
  //   ppr: 'incremental',
  //   
  //   // Enable use cache directive for better caching
  //   useCache: true,
  //   
  //   // Enable React Compiler for automatic optimizations
  //   reactCompiler: true,
  //   
  //   // Enhanced router cache configuration
  //   staleTimes: {
  //     dynamic: 30, // 30 seconds for dynamic content
  //     static: 180, // 3 minutes for static content
  //   },
  // },
  
  // Production-ready optimizations that work with stable Next.js 15
  experimental: {
    // Enhanced router cache configuration
    staleTimes: {
      dynamic: 30, // 30 seconds for dynamic content
      static: 180, // 3 minutes for static content
    },
  },
  
  // Bundle size optimizations - optimize specific packages
  transpilePackages: [
    'lucide-react',
  ],
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

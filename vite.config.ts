
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import { fileURLToPath } from "url";
import path from "path";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  const plugins = [
    react(),
    tailwindcss(),
    ...(isDev ? [jsxLocPlugin()] : []),
    visualizer({
      emitFile: true,
      filename: "bundle-stats.html",
      open: false
    })
  ];

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
      },
    },
    envDir: path.resolve(__dirname),
    root: path.resolve(__dirname, "client"),
    publicDir: path.resolve(__dirname, "client", "public"),
    build: {
      outDir: path.resolve(__dirname, "client", "dist"),
      emptyOutDir: true,
      sourcemap: isDev ? true : 'hidden',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'framer-motion': ['framer-motion'],
            'ui-vendor': ['lucide-react', 'wouter'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'utils': ['date-fns', 'clsx', 'tailwind-merge'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
    server: {
      host: true,
      proxy: {
        // Updated to point to Wrangler (Cloudflare)
        // Proxy to Cloudflare Workers local dev
        "/api": "http://localhost:8788",
      },
      allowedHosts: [
        ".manuspre.computer",
        ".manus.computer",
        ".manus-asia.computer",
        ".manuscomputer.ai",
        ".manusvm.computer",
        "localhost",
        "127.0.0.1",
      ],
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
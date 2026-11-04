import path from 'path';
import { fileURLToPath } from 'url';
import withPWAInit from 'next-pwa';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const isCloudflareExport = process.env.CF_STATIC_EXPORT === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isCloudflareExport
    ? {
        output: 'export',
        distDir: '.open-next/assets',
        images: { unoptimized: true },
      }
    : {}),
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default withPWA(nextConfig);

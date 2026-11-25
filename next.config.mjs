/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML in ./out, served by GitHub Pages at amirjaz.ir.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Pin the project root so a lockfile higher up the disk is never picked up.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;

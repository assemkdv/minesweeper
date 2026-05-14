/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/minesweeper',
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;

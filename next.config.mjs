/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "@headlessui/react"],
  },
};

export default nextConfig;

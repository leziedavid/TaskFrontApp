/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tailwindui.com',
            },
            {
                protocol: 'https',
                hostname: 'example.com',
            },
            {
                protocol: 'https',
                hostname: 'another-example.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: '192.168.4.55',
                port: '8080',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8090',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8090',
                pathname: '/api/v1/storage/**',
            },
            {
                protocol: 'http',
                hostname: '192.168.4.55',
                port: '8080',
                pathname: '/api/v1/storage/**',
            },
        ],
    },
};

export default nextConfig;

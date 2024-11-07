/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/auth/github/callback',
                destination: '/api/auth/github/callback',
                permanent: true,
            },
            {
                source: '/auth/google/callback',
                destination: '/api/auth/google/callback',
                permanent: true,
            },
            {
                source: '/auth-error',
                destination: '/auth-error',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "https",
				hostname: "hamatulin.onrender.com",
				pathname: '/media/**',
			},
		],
	},
};

module.exports = nextConfig;


// images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'hamatulin.onrender.com',
//         pathname: '/media/**',
//       },
//     ],
//   },

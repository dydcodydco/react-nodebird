// next.config.js

const nextConfig = {
	/* config options here */
	// reactStrictMode: true,
	swcMinify: true,
	transpilePackages: ["antd", "@ant-design", "rc-util", "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip"],
	compress: true,
	compiler: {
		styledComponents: {
			ssr: true,
			displayName: true,
		},
	},
};

module.exports = nextConfig;

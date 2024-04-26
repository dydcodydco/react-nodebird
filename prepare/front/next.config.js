// next.config.js

const nextConfig = {
	/* config options here */
	// reactStrictMode: true,
	// swcMinify: true,
	transpilePackages: [
		"antd",
		"@ant-design",
		"rc-util",
		"rc-pagination",
		"rc-picker",
		"rc-notification",
		"rc-tooltip",
	],
	compiler: {
		styledComponents: true,
	},
};

module.exports = nextConfig;

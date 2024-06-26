const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  images: {
    domains: [
      'react-nodebird.s3.ap-northeast-2.amazonaws.com',
      'react-nodebird-s3.s3.amazonaws.com',
    ],
  },
  compress: true,
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
    },
  },
  transpilePackages: [ "antd", "@ant-design", "rc-util", "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip", "rc-tree", "rc-table" ],
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production';
    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-source-map' : 'inline-source-map',
      plugins: [...config.plugins],
    };
  },
});

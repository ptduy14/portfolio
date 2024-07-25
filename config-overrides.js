// config-overrides.js

module.exports = function override(config, env) {
    // Thêm các phần tùy chỉnh cấu hình Webpack tại đây
    config.resolve = {
      ...config.resolve,
      extensions: ['.js', '.jsx', '.json', '.mjs'],
    };
    
    config.module.rules.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    });
  
    return config;
  };
  
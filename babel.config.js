module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        // import 절대경로 세팅
        // ex) import Test from 'src/test/index';
        'module-resolver',
        {
          root: ['.'],
        },
      ],
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": true,
        "allowUndefined": true
      }],
    ],
  };
};

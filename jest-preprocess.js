const babelOptions = {
  presets: ["babel-preset-gatsby"],
  plugins: ["transform-flow-strip-types"],
};

module.exports = require("babel-jest").createTransformer(babelOptions);

var path = require("path");
var {
  override,
  addDecoratorsLegacy,
  disableEsLint,
  addWebpackAlias,
  useBabelRc,
  fixBabelImports,
} = require("customize-cra");
module.exports = override(
  addDecoratorsLegacy(),
  disableEsLint(),
  addWebpackAlias({
    "@": path.join(__dirname, "./src/"),
  }),
  //按需加载antd-mobile
  fixBabelImports("import", { libraryName: "antd-mobile", style: "css" })
);

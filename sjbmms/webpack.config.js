const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.jsx",
  //devserver默认host:localhost 是不能通过ip访问的，要访问的话要加host : '0.0.0.0'
  devServer: {
    contentBase: path.join(__dirname, "./public"),
    port: 2004,
    compress: true,
  },
  output: {
    path: path.resolve("./dist"),
    filename: "js/[name]-[hash:5]-bundle.js",
    // publicPath:'/public'
  },

  resolve: {
    // 路径别名
    alias: {
      "@": path.resolve("./src"),
      "~": path.resolve("./src/views"),
    },
    // 默认扩展名
    extensions: [".js", ".jsx"],
  },

  module: {
    rules: [
      //尺子
      // js加载器
      {
        test: /\.jsx?$/, // .js,.jsx  土豆
        use: [
          {
            loader: "babel-loader", //ol 翘臀
            options: {
              presets: ["@babel/preset-react"], // 插件集合 小PP
              plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                ["@babel/plugin-proposal-class-properties", { loose: true }],
                //yarn add babel-plugin-import  UI组件按需引入
                ["import", { libraryName: "antd", style: "css" }, "antd"],
              ],
            },
          },
        ],
      },

      // css loader:css-loader + style-loader
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },

      // sass: sass-loader
      // sass->css->style
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./public/index.html"),
      // filename:'home.html'
    }), // 用于生成html文件（默认为index.html）
  ],
};

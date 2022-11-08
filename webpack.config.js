const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // punto de entrada de la aplicación
  entry: "./src/index.js",
  // donde se enviará donde mandará webpack
  output: {
    // directorio del proyecto y nombre de como se guardará
    path: path.resolve(__dirname, "dist"),
    // nombre del archivo de producción
    filename: "main.js",
  },
  // los archivos que webpack va entender
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  // permite añadir una configuración
  module: {
    // rules: las reglas del proyecto
    rules: [
      {
        // saber que tipo de extensiones vamos a utilizar
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        // utilizar css y scss, se carga el loader
        test: /\.(sa|sc|c)ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    // configuras HTML para producción
    new HtmlWebpackPlugin({
      // inserción de los elementos
      inject: true,
      template: "./public/index.html",
      //resultado del build
      filename: "./index.html",
    }),
    // utilización del recurso
    new MiniCssExtractPlugin(),
  ],
};

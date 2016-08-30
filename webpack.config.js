var path = require("path");

module.exports = {
    entry: ["babel-polyfill", "./src/index.js"],
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "build/assets"),
        publicPath: "/assets"
    },
    debug: true,
    devtool: "#eval-source-map",
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel"
            },
            {
                test: /\.json$/,
                loader: "json"
            }
        ]
    }
};
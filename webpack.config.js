const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./src/com/mendix/widget/timeseries/TimeSeries.ts",
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/com/mendix/widget/timeseries/TimeSeries.js",
        libraryTarget:  "umd",
        umdNamedDefine: true,
        library: "com.mendix.widget.timeseries.TimeSeries"
    },
    resolve: {
        extensions: [ "", ".ts", ".js", ".jsx", ".json" ]
    },
    errorDetails: true,
    module: {
        loaders: [
            { test: /\.ts?$/, loader: "ts-loader" },
            { test: /\.json$/, loader: "json" },
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            { test: /\.jsx?$/, loader: "babel-loader" }
        ]
    },
    devtool: "source-map",
    externals: [ "mxui/widget/_WidgetBase", "mendix/lang", "dojo/_base/declare" ],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.js" },
            { from: "src/**/*.xml" },
            { from: "src/**/*.css" }
        ], {
            copyUnmodified: true
        }),
        new ExtractTextPlugin("./src/com/mendix/widget/timeseries/ui/TimeSeries.css")
    ],
    watch: true
};

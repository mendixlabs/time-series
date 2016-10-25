var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/TimeSeries/widget/TimeSeries.tsx",
    output: {
        path: __dirname + "/dist/tmp",
        filename: "src/TimeSeries/widget/TimeSeries.js",
        libraryTarget:  "umd",
        umdNamedDefine: true,
        library: "TimeSeries.widget.TimeSeries"
    },
    resolve: {
        extensions: [ "", ".ts", ".tsx", ".js", ".json" ]
    },
    errorDetails: true,
    module: {
        loaders: [
            { test: /\.tsx?$/, loaders: [ "ts-loader" ] },
            { test: /\.json$/, loader: "json" }
        ]
    },
    devtool: "source-map",
    externals: [ "mxui/widget/_WidgetBase", "mendix/lang", "dojo/_base/declare" ],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.js" },
            { from: "src/**/*.xml" },
            { from: "src/**/*.css" },

        ], {
            copyUnmodified: true
        })
    ],
    watch: true
};

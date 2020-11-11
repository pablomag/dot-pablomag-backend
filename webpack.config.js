const path = require("path");
const Dotenv = require("dotenv-webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = [
    {
        devtool: "cheap-module-source-map",
        entry: ["./src/scripts/main/app.ts"],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.(svg|ico)$/,
                    exclude: /node_modules/,
                    loader: "url-loader",
                    query: {
                        limit: 1,
                        name: "[name].[ext]",
                    },
                },
            ],
        },
        resolve: {
            extensions: [".ts"],
        },
        output: {
            path: path.resolve(__dirname, "./"),
            filename: "./dist/scripts/app.js",
        },
        plugins: [
            new Dotenv(),
            new CopyPlugin({
                patterns: [
                    {
                        from: "./favicon.ico",
                        to: "./dist/favicon.ico",
                    },
                    {
                        from: "./dot-pablomag.svg",
                        to: "./dist/dot-pablomag.svg",
                    },
                    {
                        from:
                            "./node_modules/@fortawesome/fontawesome-free/webfonts",
                        to: "./dist/webfonts",
                    },
                ],
            }),
        ],
    },
];

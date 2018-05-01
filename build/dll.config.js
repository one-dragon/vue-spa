

const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Options = require('./options');

module.exports = {
    entry: {
        vendor:['vue', 'axios', 'vue-router', 'vuex', 'babel-polyfill'].concat(Options.build.vendor)
    },
    output: {
        path: path.resolve(__dirname, '../src/static'),
        filename: 'vendor/[name].[chunkhash:3].js',
        library: '[name]_library'
    },
    resolve: {
        extensions: ['.js', '.vue', '.scss', '.less', '.json', '.json5'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        }
    },
    plugins: [
        new CleanWebpackPlugin(
            ['src/static/vendor'],
            {
                root: path.join(__dirname, '..'),
                verbose: true,
                dry: false,
            }
        ),
        new webpack.DllPlugin({
            context: path.join(__dirname, '..'),
            name: '[name]_library',
            path: path.resolve(__dirname, '../src/static/vendor/manifest.json'),
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new UglifyJSPlugin({
            sourceMap: true,
            parallel: true,
            extractComments: {
                filename: 'LICENSES'
            },
            uglifyOptions: {
                comments: false,
                output: {
                    comments: false,
                },
                compress: {
                    warnings: false
                },
            }
        })
    ]
};
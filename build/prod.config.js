
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./base.config');
const Options = require('./options');
const { getDllVendor } = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const prodConfig = merge(baseConfig, {
    output: {
        filename: 'js/[name].[chunkhash:3].js',
        chunkFilename: 'js/[name].[chunkhash:3].js',
        publicPath: Options.build.publicPath || '/',
    },
    devtool: false,
    plugins: [
        new CleanWebpackPlugin(
            ['dist/*'],
            {
                root: path.join(__dirname, '..'),
                verbose: true,
                dry: false,
            }
        ),
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: '"production"' },
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
    ],
})


if (Options.build.analyze) {
    prodConfig.plugins.push(
        new BundleAnalyzerPlugin(Object.assign({}, Options.build.analyze))
    )
}

const extractCSS = Options.build.extractCSS;
const extractOptions = Object.assign(
    { filename: 'css/' + '[name].[contenthash:3].css' },
    typeof extractCSS === 'object' ? extractCSS : {},
)
prodConfig.plugins.push(new ExtractTextPlugin(extractOptions));

if(typeof Options.build.extend === 'function') {
    const isDev = process.env.NODE_ENV == 'development';
    const extendedConfig = Options.build.extend.call(this, prodConfig, { isDev });
    if(extendedConfig !== undefined) {
        prodConfig = extendedConfig;
    }
}

module.exports = new Promise((resolve, reject) => {
    let htmlOptions = {
        jsFiles: '',
        filename: 'index.html',
        template: './src/app/app.html',
        inject: true,
        minify: {  
            removeComments: true,
            collapseWhitespace: true
        }
    }
    if(!Options.build.useDllPlugin) {
        htmlOptions.chunks = ['manifest', 'vendor', 'app'];
        htmlOptions.chunksSortMode = (chunk1, chunk2) => {
            var order = ['manifest', 'vendor', 'app'];
            var order1 = order.indexOf(chunk1.names[0]);
            var order2 = order.indexOf(chunk2.names[0]);
            return order1 - order2;
        }
        prodConfig.plugins.push(
            new HtmlWebpackPlugin(htmlOptions)
        )
        resolve(prodConfig);
    }
    if(Options.build.useDllPlugin) {
        getDllVendor((jsName) => {
            htmlOptions.jsFiles = jsName 
                ? `<script src="${Options.build.publicPath || '/'}static/vendor/${jsName}"></script>` 
                : '';
            prodConfig.plugins.push(
                new HtmlWebpackPlugin(htmlOptions)
            )
            resolve(prodConfig);
        })
    }
})
// module.exports = prodConfig;




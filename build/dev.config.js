
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./base.config');
const Options = require('./options');
const { createNotifierTip, getDllVendor } = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const devConfig = merge(baseConfig, {
    output: {
        publicPath: `http://${Options.local.host}:${Options.local.port}/`,
    },
    devtool: 'cheap-source-map',
    devServer: {
        contentBase: './',
        historyApiFallback: true,
        hot: true,
        inline: true,
        stats: { colors: true },
        quiet: true,
        overlay: {
            warnings: false,
            errors: true,
        },
        disableHostCheck: true,
        host: Options.local.host,
        port: Options.local.port,
        proxy: Options.proxy,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: '"development"' },
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), 
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Your application is running here: http://${Options.local.host}:${Options.local.port}`],
            },
            onErrors: createNotifierTip(),
        }),
        new OpenBrowserPlugin({
            url: `http://${Options.local.host}:${Options.local.port}/`,
        }),
    ]
})

const extractCSS = Options.build.extractCSS;
const extractOptions = Object.assign(
    { filename: 'css/' + '[name].css' },
    typeof extractCSS === 'object' ? extractCSS : {},
)
devConfig.plugins.push(new ExtractTextPlugin(extractOptions));

if(typeof Options.build.extend === 'function') {
    const isDev = process.env.NODE_ENV == 'development';
    const extendedConfig = Options.build.extend.call(this, devConfig, { isDev });
    if(extendedConfig !== undefined) {
        devConfig = extendedConfig;
    }
}

module.exports = new Promise((resolve, reject) => {
    let htmlOptions = {
        jsFiles: '',
        filename: 'index.html',
        template: './src/app/app.html',
        inject: true
    }
    if(!Options.build.useDllPlugin) {
        devConfig.plugins.push(
            new HtmlWebpackPlugin(htmlOptions)
        )
        resolve(devConfig);
    }
    if(Options.build.useDllPlugin) {
        getDllVendor((jsName) => {
            htmlOptions.jsFiles = jsName 
                ? `<script src="http://${Options.local.host}:${Options.local.port}/static/vendor/${jsName}"></script>` 
                : '';
            devConfig.plugins.push(
                new HtmlWebpackPlugin(htmlOptions)
            )
            resolve(devConfig);
        })
    }
})
// module.exports = devConfig;

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
    // cheap-module-eval-source-map is faster for development
    // devtool: 'eval-source-map',
    devtool: 'cheap-source-map',
    devServer: {
        contentBase: './',
        historyApiFallback: true,
        hot: true,
        inline: true,
        stats: { colors: true },
        quiet: true, // necessary for FriendlyErrorsPlugin
        overlay: {
            warnings: false,
            errors: true,
        },
        // watchOptions: {
        //     poll: true,
        // },
        disableHostCheck: true,
        host: Options.local.host,
        port: Options.local.port,
        proxy: Options.proxy,
    },
    plugins: [
        // 设置全局变量，代码中也可用
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: '"development"' },
        }),
        
        /*
        // css打包
        new ExtractTextPlugin({
            filename: 'css/' + '[name].css',
            allChunks: false
        }),
        */
        
        /*
        // html打包，引入入口js文件
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/app/app.html',
            inject: true
        }),
        */
        
        // 启用热替换模块(Hot Module Replacement)，也被称为 HMR。
        new webpack.HotModuleReplacementPlugin(),
        
        // HMR shows correct file names in console on update.
        new webpack.NamedModulesPlugin(), 
        
        // 在编译出现错误时，跳过输出阶段，编译后提示。
        new webpack.NoEmitOnErrorsPlugin(),
        
        // 编译完成， 成功、失败提示
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Your application is running here: http://${Options.local.host}:${Options.local.port}`],
            },
            onErrors: createNotifierTip(),
        }),
        
        // 编译完成，自动打开浏览器
        new OpenBrowserPlugin({
            url: `http://${Options.local.host}:${Options.local.port}/`,
        }),
    ]
})

// css打包
const extractCSS = Options.build.extractCSS;
const extractOptions = Object.assign(
    { filename: 'css/' + '[name].css' },
    typeof extractCSS === 'object' ? extractCSS : {},
)
devConfig.plugins.push(new ExtractTextPlugin(extractOptions));

// extend配置
if(typeof Options.build.extend === 'function') {
    const isDev = process.env.NODE_ENV == 'development';
    const extendedConfig = Options.build.extend.call(this, devConfig, { isDev });
    // 只返回配置文件，以返回向后兼容性。
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
    // 使用CommonsChunkPlugin插件打包公共文件
    if(!Options.build.useDllPlugin) {
        devConfig.plugins.push(
            // html打包，引入入口js文件
            new HtmlWebpackPlugin(htmlOptions)
        )
        resolve(devConfig);
    }
    // 使用DllPlugin打包公共文件
    if(Options.build.useDllPlugin) {
        getDllVendor((jsName) => {
            htmlOptions.jsFiles = jsName 
                ? `<script src="http://${Options.local.host}:${Options.local.port}/static/vendor/${jsName}"></script>` 
                : '';
            devConfig.plugins.push(
                // html打包，引入入口js文件
                new HtmlWebpackPlugin(htmlOptions)
            )
            resolve(devConfig);
        })
    }
})
// module.exports = devConfig;
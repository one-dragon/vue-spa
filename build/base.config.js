
const webpack = require('webpack');
const path = require('path');
const vueLoader = require('./vue-loader');
const styleLoader = require('./style-loader');
const Options = require('./options');
const { getBabelOptions } = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require("inline-manifest-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack');

//eslint配置
const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [path.resolve(__dirname, '../src')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        // emitWarning: false
    }
})


/**************/
const baseConfig = {
    entry: {
        app: './src/app/app.js',
        // vendor: ['vue', 'axios', 'vue-router', 'vuex', 'babel-polyfill'].concat(Options.build.vendor),
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.vue', '.scss', '.less', '.json', '.json5'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.join(__dirname, '..', 'src'),
            '~': path.join(__dirname, '..', 'src'),
        }
    },
    module: {
        noParse: /es6-promise\.js$/, // Avoid webpack shimming process
        rules: [
            ...(Options.build.useEslint ? [createLintingRule()] : []),
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoader,
            },
            {
                test: /\.jsx?$/,
                use: 'happypack/loader?id=js',
                // loader: 'babel-loader',
                // options: getBabelOptions(),
                include: Array.isArray(Options.build.babelLoaderInclude) && Options.build.babelLoaderInclude.length > 0
                ? Options.build.babelLoaderInclude 
                : [ path.resolve(__dirname, '../src') ],
            },
            {
                // 使所有以 .json5 结尾的文件使用 `json5-loader`
                test: /\.json5$/,
                loader: 'json5-loader',
            },
            { 
                test: /\.css$/, 
                use: styleLoader.call(this, 'css'),
            },
            { 
                test: /\.less$/, 
                use: styleLoader.call(this, 'less', 'less-loader'),
            },
            {
                test: /\.sass$/,
                use: styleLoader.call(this, 'sass', {
                    loader: 'sass-loader',
                    options: { indentedSyntax: true }
                }),
            },
            { 
                test: /\.scss$/, 
                use: styleLoader.call(this, 'scss', 'sass-loader'),
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 1000, // 1KO
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 1000, // 1 KO
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(webm|mp4)$/,
                loader: 'file-loader',
                options: {
                    name: 'videos/[name].[hash:7].[ext]'
                }
            },
        ]
    },
    plugins: [
    
        //采用多进程去打包构建
        new HappyPack({
            id: 'js',
            threads: 4,
            loaders: [{
                loader: 'babel-loader',
                options: getBabelOptions(),
            }]
        }),
        
        /*
        //框架、插架打包成公共js
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
            minChunks: Infinity
        }),
        
        // 把manifest.js文件打到html中减少一次http请求， 并且往</body>前加入代码：<%= htmlWebpackPlugin.files.webpackManifest %>
        new InlineManifestWebpackPlugin(),
        */
        
        //复制文件
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../src/static'),
            to: 'static',
        }])
        
    ].concat(Options.build.plugins)
}

// 使用CommonsChunkPlugin插件打包公共文件
if(!Options.build.useDllPlugin) {
    baseConfig.entry.vendor = ['vue', 'axios', 'vue-router', 'vuex', 'babel-polyfill'].concat(Options.build.vendor);
    baseConfig.plugins = baseConfig.plugins.concat([
        //框架、插架打包成公共js
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
            minChunks: Infinity
        }),
        
        // 把manifest.js文件打到html中减少一次http请求， 并且往</body>前加入代码：<%= htmlWebpackPlugin.files.webpackManifest %>
        new InlineManifestWebpackPlugin(),
    ])
}
// 使用DllPlugin打包公共文件
if(Options.build.useDllPlugin) {
    baseConfig.plugins.push(
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, '..'),
            manifest: require("../src/static/vendor/manifest.json"),
        }),
    )
}

module.exports = baseConfig;

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
        noParse: /es6-promise\.js$/,
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
                include: Array.isArray(Options.build.babelLoaderInclude) && Options.build.babelLoaderInclude.length > 0
                ? Options.build.babelLoaderInclude 
                : [ path.resolve(__dirname, '../src') ],
            },
            {
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
        new HappyPack({
            id: 'js',
            threads: 4,
            loaders: [{
                loader: 'babel-loader',
                options: getBabelOptions(),
            }]
        }),
        //复制文件
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../src/static'),
            to: 'static',
        }])
        
    ].concat(Options.build.plugins)
}

if(!Options.build.useDllPlugin) {
    baseConfig.entry.vendor = ['vue', 'axios', 'vue-router', 'vuex', 'babel-polyfill'].concat(Options.build.vendor);
    baseConfig.plugins = baseConfig.plugins.concat([
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
            minChunks: Infinity
        }),
        new InlineManifestWebpackPlugin(),
    ])
}
if(Options.build.useDllPlugin) {
    baseConfig.plugins.push(
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, '..'),
            manifest: require("../src/static/vendor/manifest.json"),
        }),
    )
}

module.exports = baseConfig;
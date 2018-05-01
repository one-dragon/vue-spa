
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
        // 删除文件
        new CleanWebpackPlugin(
            ['dist/*'],                                 // 匹配删除的文件
            {
                root: path.join(__dirname, '..'),       // 根目录
                verbose: true,                          // 开启在控制台输出信息
                dry: false,                             // 启用删除文件
            }
        ),
        
        // 设置全局变量，代码中也可用
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: '"production"' },
        }),
        
        /*
        // css打包
        new ExtractTextPlugin({
            filename: 'css/' + '[name].[contenthash:3].css',
            allChunks: false
        }),
        */
        
        /*
        // html打包，引入入口js文件
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/app/app.html',
            chunks: ['manifest', 'vendor', 'app'],
            inject: true,
            minify: {                           //压缩HTML文件
                removeComments: true,           //移除HTML中的注释
                collapseWhitespace: true        //删除空白符与换行符
                //removeAttributeQuotes: true,  //移除属性的引号
            },
            chunksSortMode: function(chunk1, chunk2) {
                var order = ['manifest', 'vendor', 'app'];
                var order1 = order.indexOf(chunk1.names[0]);
                var order2 = order.indexOf(chunk2.names[0]);
                return order1 - order2;
            }
        }),
        */
        
        //scope hoistingScope Hoisting-作用域提升
        new webpack.optimize.ModuleConcatenationPlugin(),
        
        //会根据模块的相对路径生成一个几位数的hash作为模块id
        new webpack.HashedModuleIdsPlugin(),
        
        //压缩插件
        new UglifyJSPlugin({
            // cache: true,
            sourceMap: true,
            parallel: true,
            extractComments: {
                filename: 'LICENSES'
            },
            uglifyOptions: {
                comments: false,
                output: {
                    comments: false, //remove all comments去掉所有注释
                },
                compress: {
                    warnings: false
                },
                // mangle: {
                //    except: ['$super', '$', 'exports', 'require']
                // }
            }
        })
    ],
})


// webpack可视化构建
if (Options.build.analyze) {
    prodConfig.plugins.push(
        new BundleAnalyzerPlugin(Object.assign({}, Options.build.analyze))
    )
}

// css打包
const extractCSS = Options.build.extractCSS;
const extractOptions = Object.assign(
    { filename: 'css/' + '[name].[contenthash:3].css' },
    typeof extractCSS === 'object' ? extractCSS : {},
)
prodConfig.plugins.push(new ExtractTextPlugin(extractOptions));

// extend配置
if(typeof Options.build.extend === 'function') {
    const isDev = process.env.NODE_ENV == 'development';
    const extendedConfig = Options.build.extend.call(this, prodConfig, { isDev });
    // 只返回配置文件，以返回向后兼容性。
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
        minify: {                           //压缩HTML文件
            removeComments: true,           //移除HTML中的注释
            collapseWhitespace: true        //删除空白符与换行符
            //removeAttributeQuotes: true,  //移除属性的引号
        }
    }
    // 使用CommonsChunkPlugin插件打包公共文件
    if(!Options.build.useDllPlugin) {
        htmlOptions.chunks = ['manifest', 'vendor', 'app'];
        htmlOptions.chunksSortMode = (chunk1, chunk2) => {
            var order = ['manifest', 'vendor', 'app'];
            var order1 = order.indexOf(chunk1.names[0]);
            var order2 = order.indexOf(chunk2.names[0]);
            return order1 - order2;
        }
        prodConfig.plugins.push(
            // html打包，引入入口js文件
            new HtmlWebpackPlugin(htmlOptions)
        )
        resolve(prodConfig);
    }
    // 使用DllPlugin打包公共文件
    if(Options.build.useDllPlugin) {
        getDllVendor((jsName) => {
            htmlOptions.jsFiles = jsName 
                ? `<script src="${Options.build.publicPath || '/'}static/vendor/${jsName}"></script>` 
                : '';
            prodConfig.plugins.push(
                // html打包，引入入口js文件
                new HtmlWebpackPlugin(htmlOptions)
            )
            resolve(prodConfig);
        })
    }
})
// module.exports = prodConfig;




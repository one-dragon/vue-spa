

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
        
        // 删除文件
        new CleanWebpackPlugin(
            ['src/static/vendor'],                      // 匹配删除的文件
            {
                root: path.join(__dirname, '..'),       // 根目录
                verbose: true,                          // 开启在控制台输出信息
                dry: false,                             // 启用删除文件
            }
        ),
        
        // 拆分 bundles，同时还大大提升了构建的速度
        new webpack.DllPlugin({
            context: path.join(__dirname, '..'),
            name: '[name]_library',
            path: path.resolve(__dirname, '../src/static/vendor/manifest.json'),
        }),
        
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
//              mangle: {
//                  except: ['$super', '$', 'exports', 'require']
//              }
            }
        })
    ]
};
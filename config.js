

const vuxLoader = require('vux-loader');
const path = require('path');

module.exports = {
    build: {
        // 针对build后分析并可视化构建后的打包文件，你可以基于分析结果来决定如何优化它，默认为false
        analyze: false,
        // 打包 进行扩展配置, config: webpack配置内容;  isDev: 是否为开发模式
        extend: (config, { isDev }) => {
            // config.devtool = 'eval-source-map';
            // console.log('isDev:' + isDev);
            // 配置vux
            vuxLoader.merge(config, {
                plugins: [
                    {
                        name: 'vux-ui'
                    }, 
                    {
                        name: 'duplicate-style'
                    }
                ]
            })
        },
        //设置babel-loader里的include，默认为include为src目录
        babelLoaderInclude: [
            path.resolve(__dirname, './src'),
            path.resolve(__dirname, './node_modules/vux/src'),
        ],
        // js编译设置， 配置element-ui按需引入
        babel: {
            'plugins': [
                [
                    'component',
                    {
                        'libraryName': 'element-ui',
                        'styleLibraryName': 'theme-chalk'
                    }
                ]
            ]
        },
        // npm run build时设置访问路径，默认为'/'
        publicPath: '/2018-webpack/dist/',
        // 公共文件，打包默认:'vue', 'axios', 'vue-router', 'vuex', 'babel-polyfill'
        vendor: [],
        // 是否使用eslint, 默认使用
        useEslint: true,
        // 是否使用DllPlugin打包公共文件， 默认使用CommonsChunkPlugin插件打包公共文件
        useDllPlugin: false
    },
    // 开发模式下访问地址
    local: {
        host: 'localhost',
        port: 8000
    },
    // 开发模式下配置反向代理
    proxy: {
        '/cq-ocms': {
            target: 'https://www.cuniq.com',
            changeOrigin: true,
            secure: false,
            //pathRewrite: { '^/cq-ocms' : '/' }
        },
    },
}

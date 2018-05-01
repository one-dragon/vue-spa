

const merge = require('webpack-merge');
const config = require('../config');

const options = merge({
    build: {
        // 针对build后分析并可视化构建后的打包文件，你可以基于分析结果来决定如何优化它，默认为false
        analyze: false,
        // css打包设置
        extractCSS: {
            allChunks: false,
        },
        // 打包进行扩展配置
        extend: (config, { isDev }) => {
            
        },
        //设置babel-loader里的include，默认为include为src目录
        babelLoaderInclude: [],
        // js编译设置
        babel: {
            /*
            "plugins": [
                [
                    "component",
                    {
                        "libraryName": "element-ui",
                        "styleLibraryName": "theme-chalk"
                    }
                ]
            ]
            */
        },
        // webpack加入插件
        plugins: [],
        // npm run build时设置访问路径，默认为'/'
        publicPath: '',
        // 公共文件，默认:'vue', 'axios', 'vue-router', 'vuex', 'babel-polyfill'
        vendor: [],
        // 是否使用eslint, 默认使用
        useEslint: true,
        // 是否使用DllPlugin打包公共文件， 默认使用CommonsChunkPlugin插件打包公共文件
        useDllPlugin: false
    },
    // 开发模式下访问地址
    local: {
        host: '',
        port: ''
    },
    // 开发模式下配置反向代理
    proxy: {
        /*
        '/cq-ocms': {
            target: 'https://www.cuniq.com',
            changeOrigin: true,
            secure: false,
            //pathRewrite: { '^/cq-ocms' : '/' }
        },
        */
    },
}, config);

module.exports = options;
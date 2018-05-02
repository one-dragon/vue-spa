
const path = require('path');
const createResolver = require('postcss-import-resolver');
module.exports = function postcssConfig(isArr) {
    const pluginsArr = [
        require('postcss-import')({
            resolve: createResolver({
                alias: {
                    '@': path.join(__dirname, '..', 'src'),
                    '~': path.join(__dirname, '..', 'src'),
                },
            })
        }),
        require('autoprefixer')({browsers:'last 5 versions'}),
        require('cssnano')({ safe: true }),
    ]
    return {
        sourceMap: process.env.NODE_ENV == 'development',
        useConfigFile: false,
        plugins: isArr ? pluginsArr : (loader) => pluginsArr,
    }
}

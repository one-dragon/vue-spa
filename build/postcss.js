
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
        // require('postcss-url')();
        // require('postcss-cssnext')(),
        require('autoprefixer')({browsers:'last 5 versions'}),
        require('cssnano')(),
    ]
    return {
        sourceMap: process.env.NODE_ENV == 'development',
        useConfigFile: false,
        // ident: 'postcss',
        plugins: isArr ? pluginsArr : (loader) => pluginsArr,
    }
}

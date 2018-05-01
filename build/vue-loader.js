
const styleLoader = require('./style-loader');
const { getBabelOptions } = require('./utils');
const postcssConfig = require('./postcss');
module.exports = {
    postcss: postcssConfig.call(this, true),
    extractCSS: true,
    cssSourceMap: process.env.NODE_ENV == 'development',
    preserveWhitespace: false,
    loaders: {
        js: {
            loader: 'babel-loader',
            options: getBabelOptions(),
        },
        css: styleLoader.call(this, 'css', [], true),
        less: styleLoader.call(this, 'less', 'less-loader', true),
        scss: styleLoader.call(this, 'scss', 'sass-loader', true),
        sass: styleLoader.call(
            this,
            'sass',
            { loader: 'sass-loader', options: { indentedSyntax: true } },
            true
        ),
    },
    transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href'
    }
}
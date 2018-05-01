
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcssConfig = require('./postcss');
module.exports = function styleLoader(ext, loaders = [], isVueLoader = false) {
    const sourceMap = process.env.NODE_ENV == 'development';
    
    loaders = (Array.isArray(loaders) ? loaders : [loaders]).map( (loader) => {
        return Object.assign(
            { options: { sourceMap } },
            typeof loader === 'string' ? { loader } : loader
        )
    })
    
    const vueStyleLoader = {
        loader: 'vue-style-loader',
        options: { sourceMap }
    }
    
    loaders.unshift({
        loader: 'postcss-loader',
        options: postcssConfig(),
    })
    
    loaders.unshift({
        loader: 'css-loader',
        options: {
            sourceMap,
            minimize: !sourceMap,
            importLoaders: loaders.length, // Important!
            //alias: {
                //'/static': join(this.options.srcDir, 'static'),
                //'/assets': join(this.options.srcDir, 'assets')
            //}
        }
    })
    
    const extractLoader = ExtractTextPlugin.extract({
        use: loaders,
        fallback: vueStyleLoader
    })
    
    const hotLoader = {
        loader: 'css-hot-loader',
        options: { sourceMap }
    }

    return sourceMap ? [hotLoader].concat(extractLoader) : extractLoader;
    // return extractLoader;
    // return [vueStyleLoader].concat(loaders);
}
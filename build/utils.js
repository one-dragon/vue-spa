
exports.getBabelOptions = () => {
    const Options = require('./options');
    let obj = Object.assign(
        {}, 
        {
            babelrc: false,
            cacheDirectory: true,
            plugins: ['transform-vue-jsx'],
        },
        Options.build.babel
    )
    if(!Options.build.babel.presets) {
        obj.presets = [
            [
                'vue-app',
                { ie: 9, uglify: true }
            ]
        ]
    }
    return obj;
}

exports.createNotifierTip = () => {
    const path = require('path');
    const notifier = require('node-notifier');
    const pkg = require('../package.json');
    return (severity, errors) => {
        if(severity !== 'error') {
            return
        }
        const error = errors[0];
        const filename = error.file.split('!').pop();

        notifier.notify({
            title: pkg.name,
            message: severity + ': ' + error.name,
            subtitle: filename || '',
            icon: path.join(__dirname, 'logo.png'),
        })
    }
}

exports.getDllVendor = (callback) => {
    const path = require('path');
    const fs = require('fs');
    fs.readdir(path.resolve(__dirname, '../src/static/vendor'), (err, files) => {
        if(err) {
            console.log('error:' + err.message);
            throw err.message;
            return;
        }
        let jsName = '';
        files.map((item) => {
            if(item.indexOf('vendor') > -1) {
                jsName = item;
                return;
            }
        })
        callback ? callback(jsName) : null;
    })
}

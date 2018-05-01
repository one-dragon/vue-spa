# vue-spa
webpack3.X + Vue2全家桶(vue-router、vuex、vue-loader、vue-i18n)搭建的单页面应用  PC端用的element-ui2 移动端用的vux 

一、 安装

1.首先需要本地电脑中安装nodejs，因为webpack是基本node开发的， 我的node版本为v8.9.3，请下载v8.x.x的版本node进行安装。

2.下载当前工程，用cmd打开到当前目录下，输入npm init安装package.json中的依赖(注意npm3.x以上的版本安装包是平行依赖安装的，如果不想平行安装可以输入npm init --legacy-bundling)

3.依赖包安装完成后，可以在cmd中(当前目录下)输入npm run dev命令，当前命令表示开发版打包编译并且是实时的，还有生产版打包命令npm run build，在package.json中scripts里。

4.编译完成后浏览器会自动打开当前开发地址，可以看到首页内容


二、目录

1.build文件夹

    build文件夹下是webpack相关的配置内容，感兴趣的可以看一看~
    
2.src文件夹

    src文件夹是开发目录，里面分为：
    app文件夹的入口文件(因为是单页面应用所以只有一个html，一个主js文件)
    assets资源文件夹，可放置图片、js、css、font等文件
    i18n文件夹为国际化文件内容，可配置前端的国际化语言
    pages文件夹放置vue文件页面，并配合router文件生成路由
    router文件夹配置路由
    static文件夹放置静态文件
    store文件夹放置vuex内容
    
3.eslintrc.js

    .eslintrc.js为配置eslint内容
    
4.config.js

    config.js为配置暴露出来的api内容，可以配置相关开发内容，并且有对应的注解


三、打包

1.打包公共文件有两种方式：
    
    使用CommonsChunkPlugin插件： 默认配置，但每次打包都需要重新编译打包，花费时间较长
    
    使用DllPlugin插件： 需要在config.js里的useDllPlugin改为true，并且需要先输入npm run dll命令，打包完成后会在src\static下生成vendor公共文件，之后可以使用正常命令开发或者生产命令，好处是只需要把公共文件打包一次(如果你重新配置了 config.js里的vendor，需要重新打包一次)，编译速度大大提升

2.打包命令

    npm run dev命令为开发模式，每次修改代码都会自动编译并自动刷新页面，打包的内容都在内存之中，目录中是看不到的，基本webpack-dev-server插件的，还可以在config.j里配置反向代理(跨域请求ajax)、开发地址等
    
    npm run build命令为生成模式，打包完成后会在目录中生成dist文件夹，该文件夹内容都是压缩版的，可以放到服务器中

3.关于使用happypack

    因为vux-loader不支持happypack，所以只配置了js使用，vue文件没配置，如果想vue文件也使用happypack，需要使用别的移动ui库，可以在config.js里配置使用mint-ui移动ui库，并在build/base.config.js中配置vue文件使用happypack


四、相关技术文档

Vue官网： <a href="https://cn.vuejs.org/" target="_blank">https://cn.vuejs.org/</a>

vue-router： <a href="https://router.vuejs.org/zh-cn/" target="_blank">https://router.vuejs.org/zh-cn/</a>

vuex： <a href="https://vuex.vuejs.org/zh-cn/" target="_blank">https://vuex.vuejs.org/zh-cn/</a>

vue-i18n： <a href="https://kazupon.github.io/vue-i18n/en/" target="_blank">https://kazupon.github.io/vue-i18n/en/</a>

element-ui： <a href="http://element-cn.eleme.io/#/zh-CN" target="_blank">http://element-cn.eleme.io/#/zh-CN</a>

vux： <a href="https://vux.li/" target="_blank">https://vux.li/</a>

es6入门教程： <a href="http://es6.ruanyifeng.com/" target="_blank">http://es6.ruanyifeng.com/</a>

scss中文教程： <a href="https://www.sass.hk/guide/" target="_blank">https://www.sass.hk/guide/</a>
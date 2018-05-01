# vue-spa
webpack3.X + Vue2全家桶(vue-router、vuex、vue-loader、vue-i18n)搭建的单页面应用  PC端用的element-ui2 移动端用的vux 

一、 安装
1.首先需要本地电脑中安装nodejs，因为webpack是基本node开发的， 我的node版本为v8.9.3，请下载v8.x.x的版本node进行安装。
2.现在当前工程后，用cmd打开到当前目录下，输入npm init安装package.json中的依赖(注意npm3.x以上的版本安装包是平行依赖安装的，如果不想平行安装可以输入npm init --legacy-bundling)
3.依赖包安装完成后，可以在cmd中(当前目录)输入npm run dev命令，当前命令表示开发版打包，还有生成版打包，在package.json中scripts里有。
4.编译完成后浏览器会自动打开开发地址，可以看见我写的一个小demo

当前工程下的build文件夹下放的是webpack的配置内容


Vue官网：<a href="https://cn.vuejs.org/" target="_blank">https://cn.vuejs.org/</a>
HtmlWebpackPlugin使用文档

这个插件主要用来生成html页面。假如html页面是通过javascript生成的，那么构建工具就可以又有所作为了，1、可以使用模板。
HtmlWebpackPlugin简单理解就是用来生成html文件，并且能够将webpack构建的bundles通过script标签添加到body中。如果有css资源，就会通过style标签或者link标签将css添加到head中。

Install
Config
Plugins
Options

参数名  类型    默认值  描述
title   String   'Webpack App' 生成html文档的标题，即标签<title/>
filename String 'index.html' 文件名，可以定制为'assets/admin.html'
template    String  ''
templateParameters Boolean|Object|Function
inject  Boolean|String  true
favicon
meta
base
minify  Boolean|String 'production'模式默认为true,其他为false
hash    Boolean
cache   Boolean true


如何生成多个页面？
### CSS Module在项目中的应用实践
#### CSS Module是什么
**CSS Module**简单理解就是让CSS具备局部作用域的功能。
#### 为什么要引入CSS Module
大家都知道CSS是给页面设置样式的，它通过给不同的选择器声明样式的方式使DOM具备样式的功能。它是作用在全局的，页面中只要选择器能匹配上CSS中的选择器，声明的样式就会被应用到。CSS的全局作用域的特性就造成一个问题，样式可能会相互覆盖、相互影响。为了避免CSS的相互影响，项目一般采用约定的方式，通过给选择器唯一的标识避免CSS相互影响。这在单人开发项目或者小型项目中问题不大，但是随着项目的扩大，给不同的DOM起一个唯一的标识就变得比较麻烦，为了给DOM起一个唯一的标识，出现了越来越长的命名或者完全没有规律的命名，选择器的命名给开发增加了一定的心智负担。尤其在一个需要多人合作的项目中，避免样式的相互影响就成为一个棘手的问题，相互之间不知道对方起了哪些命名，而且如果不同的功能触发路径不同的话，开发阶段甚至发现不了。  
我目前所在的项目不仅是一个多人合作的项目，而且也是一个多BU合作的项目，外BU的某些功能会在应用中间被激活，比如点击了某个功能icon，会引入另外一个BU的功能，js会动态将外BU的功能的样式动态加载进来，这时候不确定性就变大了，遇到两个诡异的现象，排查一遍发现是CSS相互影响了。
一句话，CSS Module是为应对因CSS全局作用域引起相互影响问题的一种解决方案。
#### CSS Module的原理
CSS Module工作的原理与人工起一个**独一无二**的名称是一样的，只是通过一定的算法去给class选择器起名字。具体过程是：
1、遍历css文件中的每个css选择器，给每个css选择器生成一个**独一无二**的名称，并且输出一个原css选择器名称和生成css选择器名称的一个对象映射，暂且称作styleMap，原css选择器名称为key，新css选择器为value
2、webpack将css资源（可以理解为styleMap）作为模块管理，引入js中，模板文件中原css选择器名称替换成新css选择器名称，实现给dom起一个**独一无二**类名的目的
#### 老项目中引入CSS Module实践
CSS Modules提供各种插件，也支持不同的构建工具，我所在的项目使用的是Webpack的css-loader插件。css-loader插件配置灵活，可以支持不同情况的项目支持CSS Module功能，下面就是我们项目中开启CSS Module的一种实践。  
    1、升级css-loader版本至5.0.1，css-loader@3.0.0版本不支持新版本的配置。而github上项目配置文档为新版本配置文档  
    2、按照约定大于配置的原则，针对需要开启局部作用域的文件开启CSS Module功能。  
由于老项目已经在线上稳定运行了，如果直接开启CSS Module功能的话，则所有的class选择器都会是**局部作用域**的，但是js中使用的选择器都是全局的，这就会导致两者不匹配，样式就会不生效。为了能够兼容旧项目，约定原有的都是全局样式，即默认是全局样式；如果想开启局部样式，则约定文件名称符合**文件名.comp.scss**或者**文件名.comp.css**方式，**comp**取**component**的缩写，而现有项目中的文件均不带有**comp**标识，所以均会按照全局样式生效。配置如下：
```javascript
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        mode: (resourcePath) => {
                            // 约定符合.comp.格式的文件名采取'local'模式，默认'global'模式
                            if (/\.comp\.(css|scss)/i.test(resourcePath)) {
                                return 'local';
                            }
                            return 'global';
                        },
                        localIdentName: '[local]__[hash:base64:10]'
                    },
                    importLoaders: 1,
                    localsConvention: 'camelCase'
                }
            },
            'sass-loader'
        ]
    })
```
3、js组件开发过程中，**class类样式**采用对象引用方式。首先将样式文件作为模块引入，其次按照对象的方式使用**class类样式**。下面按照**vue**框架开发rule组件的方式展示  
```css
.outerWrapper {
    padding:20px 30px;
    background: rgba(255,255,255,1);
    width: 335px;
    height: 542px;
    ....
}
.content {
    box-sizing: border-box;
    font-size: 12px;
    line-height: 24px;
    width: 290px;
    height: 310px;
}
.close {
    width: 20px;
    height: 20px;
}
```
```javascript
// rule.js
import styles from './style.comp.scss';
export default {
    name: 'rule',
    mounted() {},
    methods: {},
    template: `<div class="${styles.outerWrapper}">
        <div class="${styles.close}">X</div>
        <div class="${styles.content}">这里是内容</div>
    </div>`
}
```
生成的样式代码为：
```css
.outerWrapper__2gEUkbxhCY {
    padding:20px 30px;
    background: rgba(255,255,255,1);
    width: 335px;
    height: 542px;
}
.content__1L1mA0aVBW {
    box-sizing: border-box;
    font-size: 12px;
    line-height: 24px;
    width: 290px;
    height: 310px;
}
.close__33mET9J6gH {
    width: 20px;
    height: 20px;
}
```
```javascript
// 生成的html，此处用字符串模拟
<div class="outerWrapper__2gEUkbxhCY">
    <div class="close__33mET9J6gH">X</div>
    <div class="content__1L1mA0aVBW">这里是内容</div>
</div>
```
    
// bind方法
// call方法
// apply方法

const { functions } = require("lodash");


Function.prototype.myBind = function(fn, context, ...firArgs) {
    // return的这个函数如果可以作为构造函数存在的话，则不能是箭头函数
    return function(...secArgs) {
        return context.fn([...firArgs, ...secArgs]);
    }
}

function fn(a, b, c) {
    return a + b + c;
}
const newFn = myBind(fn);


// 原生call的功能点有哪些？
// function.call(thisArg, arg1, arg2, ...)
// thisArg可选，function函数运行时使用的this值
Function.prototype.myCall = function(context) {
    // 如果context为null、undefined，函数体内的this指向全局
    context = context || global;
    // 如果不采用call、apply的话，如何改变一个函数的this,js原生没有提供这样的方法
    // 但是js中规定xxx.fn的时候fn内部的this指向的是xxx
    // myCall的原理就是利用xxx.fn
    context.fn = this; // this指向调用myCall的对象，比如fn.myCall(),则this指向的是fn
    // 收集函数的参数
    let args = [];
    for (let i = 1, len = arguments.length; i < len; i++) {
        args.push(`arguments[${arguments[i]}]`);
    }
    let res = eval(`${context.fn}(args.toString())`);
    delete context.fn;
    return res;
}

// ES6版本myCall
Function.prototype.myCall2 = function(context, ...args) {
    context = context || global;
    context.fn = this;
    let res = context.fn(...args);
    delete context.fn;
    return res;
}
// fn.call(context, a, b, c);
fn.myCall(context);

Function.prototype.myApply = function(context, arr) {
    context = context || global;
    context.fn = this;
    let res;
    if (!arr) {
        res = context.fn();
    } else {
        let args = [];
        for (let i = 0, len = arr.length; i < len; i++) {
            args.push(`arr[${arr[i]}]`);
        }
        res = eval(`${context.fn}(arr.toString())`);
    }
    delete context.fn;
    return res;
}

// https://juejin.cn/post/6844904063729926152
// reduce
// 1、代替reverse
function reverse(arr = []) {
    return arr.reduceRight((t, v) => (t.push(v), t), []);
}
// 2、代替map 和 filter
const a = arr.map(v => v * 2);
const b = arr.reduce((t, v) => [...t, v * 2], []);

// 3、代替some 和 every
// 4、数组分隔
function chunk(arr = [], size = 1) {
    return arr.length ? arr.reduce((t, v) => (t[t.length - 1].length === size ? t.push([v]): t[t.length - 1].push(v), t), [[]])
        : [];
}
const arr = [1, 2, 3, 4, 5];
chunk(arr, 2); // [[1, 2], [3, 4], [5]]
// 数组过滤
function difference(arr = [], oarr = []) {
    // 箭头函数不需要参数或者需要多个参数，参数需要用圆括号括起来，圆括号内部表示参数部分
    // 箭头函数的代码块部分多于一条语句，需要用大括号括起来
    // 逗号运算符，表达式1, 表达式2, 表达式3 从左执行，整个表达式的值是最后一个表达式的值
    return arr.reduce((t, v) => (!oarr.includes(v) && t.push(v), t), []);
}

// 数组填充
function fill(arr = [], val = '', start = 0, end = arr.length) {
    // 异常处理
    if (start < 0 || start >= end || end > arr.length) return arr;
    return [
        ...arr.slice(0, start),
        ...arr.slice(start, end).reduce((t, v) => (t.push(val || v), t), []),
        ...arr.slice(end, arr.length)
    ];
}

// 数组扁平
function flat(arr = []) {
    return arr.reduce((t, v) => t.concat(Array.isArray(v) ? flat(v) : v), []);
}

// 数组去重
function uniq(arr = []) {
    return arr.reduce((t, v) => t.includes(v) ? t : [...t, v], []);
}

// 数组最大值与最小值
// 参数：累加器函数，初始值
// array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
// 如果reduce未传初始值，则数据的第一项为初始值，数组的第二项为当前值
function max(arr = []) {
    return arr.reduce((t, v) => t > v ? t : v);
}
function min(arr = []) {
    return arr.reduce((t, v) => t < v ? t : v);
}

// 数组成员独立拆解
// Array.from用于将两类对象转为真正的数组：类数组对象和可遍历对象（包括es6新增的数据结构Set和Map）
function unzip(arr = []) {
    return arr.reduce(
        (t, v) => (v.forEach((w, i) => t[i].push(w)), t),
        Array.from({length: Math.max(...arr.map(v => v.length))}).map(v => [])
    );
}

// 数组成员个数统计
// 此方法是字符统计和单词统计的原理，入参时把字符串处理成数组即可
function count(arr = []) {
    return arr.reduce((t, v) =>(t[v] = (t[v] || 0) + 1, t), {});
}

// 数组成员位置记录
function position(arr = [], val) {
    return arr.reduce((t, v, i) => (v === val && t.push(i), t), []);
}

// 数组成员特性分组
function group(arr = [], key) {
    return key ? arr.reduce((t, v) => (!t[v[key]] && (t[v[key] = []]), t[v[key]].push(v), t), {})
        : {};
}

// 数组成员所含关键字统计
function keyword(arr = [], keys = []) {
    return keys.reduce((t, v) => (arr.some(w => w.includes(v)) && t.push(v), t), []);
}

// 字符串反转
function reverseStr(str = '') {
    return str.split('').reduceRight((t, v) => t + v);
}

// 数字千分化
function thunsandNum(num = 0) {
    const str = (+num).toString().split(".");
    const int = nums => nums.split("").reverse().reduceRight((t, v, i) => t + (i % 3 ? v : `${v},`), "").replace(/^,|,$/g, "");
    const dec = nums => nums.split("").reduce((t, v, i) => t + ((i + 1) % 3 ? v : `${v},`), "").replace(/^,|,$/g, "");
    return str.length > 1 ? `${int(str[0])}.${dec(str[1])}` : int(str[0]);
}

// 异步累计
async function AsyncTotal(arr = []) {
    return arr.reduce(async (t, v) => {
        const at = await t;
        const todo = await Todo(v);
        at[v] = todo;
        return at;
    }, Promise.resolve({}));
}


// 斐波那契数列
function fibonacci(len = 2) {
    const arr = [...new Array(len).keys()];
    return arr.reduce((t, v, i) => (i > 1 && t.push(t[i-1]+t[i-2]), t), [0, 1]);
}

//URL参数反序列化
function parseUrlSearch() {
    return location.search.replace(/(^\?)|(&$)/g, '').split('&')
        .reduce((t, v) => {
            const [key, val] = v.split('=');
            t[key] = decodeURIComponent(val);
            return t;
        }, {})
}

// URL参数序列化
function stringifyUrlSearch(search = {}) {
    return Object.entries(search)
        .reduce((t, v) => `${t}${v[0]}=${encodeURIComponent(v[1])}&`,
            Object.keys(search).length ? '?' : ''
        ).replace(/&$/, '');
}

// 返回对象指定键值
function getKeys(obj = {}, keys = []) {
    return Object.keys(obj).reduce((t, v) => (keys.includes(v) && (t[v] = obj[v]), t), {});
}

// 数组转对象
function arrayToObject(arr = [], key = '') {
    arr.reduce((t, v) => {
        // 对象的展开运算符是什么？
        const { key, ...rest } = v;
        t[key] = rest;
        return t;
    }, {});
}

// Redux Compose函数原理
function compose(...funs) {
    if (funs.length === 0) {
        return arg => arg;
    }
    if (funs.length === 1) {
        return funs[0];
    }

    // [fn1, fn2, fn3]
    return funs.reduce((t, v) => (...arg) => t(v(...arg)));
}

function fn1(a) {
    console.log('fn1执行了')
    return a + 1;
}
function fn2(b) {
    console.log('fn2执行了')
    return b + 1;
 }
function fn3(c) {
    console.log('fn3执行了')
    return c + 1;
}

compose(fn1, fn2, fn3)(1); // 执行顺序 fn3 fn2 fn1 参数传递了

function composeRight(...funs) {
    if (funs.length === 0) {
        return arg => arg;
    }
    if (funs.length === 1) {
        return funs[0];
    }

    // [fn1, fn2, fn3]
    return funs.reduceRight((t, v) => (...arg) => t(v(...arg)));
}
// composeRight(fn1, fn2, fn3)(); // 执行顺序 fn1 fn2 fn3


// new Array(100000).keys()返回的是一个数组迭代器
// ...展开运算符 后面可以跟随迭代器，将迭代器转换为数组
const list = [...new Array(100000).keys()];
// for
console.time('for');
let result1 = 0;
for (let i = 0; i < list.length; i++) {
    result1 += i + 1;
}
console.log(result1);
console.timeEnd('for');

// forEach
console.time('forEach');
let result2 = 0;
list.forEach(v => result2 += v + 1);
console.log(result2);
console.timeEnd('forEach');

// map
console.time('map');
let result3 = 0;
list.map(v => (result3 += v + 1, v));
console.log(result3);
console.timeEnd('map');
// reduce
console.time('reduce');
let result4 = list.reduce((t, v) => t + v + 1, 0);
console.log(result4);
console.timeEnd('reduce');

// js技巧： https://juejin.cn/post/6844903838449664013
// 检测非空参数
function IsRequired() {
    throw new Error('params is required');
}
function fn(name = IsRequired()) {
    console.log("I Love " + name);
}

// https://juejin.cn/post/6844903959283367950
// initValue可以不传
Array.prototype.myReduce = function(fn, initValue) {
    // 方法内部的this指谁调用时谁，这个方法是给数组使用的，所以this指向的是数组
    for (let i = 0; i < this.length; i++) {
        if (typeof initValue === 'undefined') {
            // 如果initValue没有传递的话，第一项作为initValue，第二项作为v，当前项就是i+1
            initValue = fn(this[i], this[i+1], i+1, this);
            i++;
        } else {
            initValue = fn(initValue, this[i], i, this);
        }
    }
    return initValue;
}

// typeof vs instanceof
// typeof 可以区分函数和对象
typeof function(){} // 'function'
typeof new Date() // 'object'
typeof new RegExp() // 'object'
typeof 1 // 'number'
typeof 'aa' // 'string'
typeof true // 'boolean'
typeof undefined // 'undefined'
typeof null // 'object'
typeof 42n // 'bigint'
// 'symbol'
// js中类型有哪些，类型判断 Number、String、Boolean、Undefined、Null、Symbol、Function、Object
// 其他类型右宿主环境决定
// 深拷贝实现需要考虑到各种类型
function deepClone(obj) {
    // 不是对象类型
    if (typeof obj !== 'object') return obj; // 包括Number、String、Undefined、Boolean、Symbol、Function
    if (obj === null) return null;
    if (obj instanceof Date) return new Date(obj); // Date类型
    if (obj instanceof RegExp) return new RegExp(obj); // 正则类型
    let target = new obj.constructor(); // 数组[]、对象{}
    for (k in obj) {
        target[k] = typeof obj[k] !== 'object' ? obj[k] : deepClone(obj[k]);
    }
    return target;
}

// Array.from 将类数组对象转换为数组对象

// String includes startWith endWith

// 继承
// 类的实现
// 类调用检测-类必须通过new关键字调用
function _classCheck(instance, contructor) {
    if (!(instance instanceof constructor)) {
        throw new Error(`${contructor} Class be called without new`);
    }
}

// 继承: 父类的私有属性（实例属性）和共有属性（原型方法）
function Parent() {
    this.name = 'parent';
}

Parent.prototype.eat = function() {
    console.log('eat');
}

function Child() {
    this.age = 9;
}
Child.prototype.smoking = function() {
    console.log('smoking');
}
// 这两个方法是等价的，原型方法（公共属性继承）
Object.setPrototypeOf(Child.prototype, Parent.prototype);
Child.prototype.__proto__ = Parent.prototype;
// 每一个对象都有一个__proto__属性，用于关联对象的前世今生

// Child.prototype = Object.create(Parent.prototype, {constructor: {value: Child}});
Child.prototype = create(Parent.prototype, {constructor: {value: Child}});

// 自己实现一个create
function create(parentPrototype, props) {
    function Fn() {}
    let fn = new Fn();
    // Fn.prototype.__proto__ = parentPrototype;
    Object.setPrototypeOf(Fn.prototype, parentPrototype);
    for (let key in props) {
        Object.defineProperty(fn, key, {
            ...props[key],
            writable: true,
            configurable: true,
            enumerable: true
        });
    }
    return fn;
}


// 跨域的方式:同源策略（协议/域名/端口号都一样为同域）
// jsonp link/script/img没有跨域的限制
// cors （与客户端没关系，服务器添加各种头即可），有一个额外的客户端withCredential=true，会携带客户端cookie
// cors：因为同源是浏览器做的，服务器只是告诉浏览器你应该如何使用就行，不需要开发做什么
// postMessage onMessage
// iframe以及借助iframe技术实现的包括hash/domain(一级/二级域名这种)/window.name
// iframe onload事件 iframe.contentWindow.postMessage
// websocket 本身websocket是开启服务，对于服务而言没有跨域的概念
// nginx
// http-proxy


// 
const { isArray } = require('lodash');
var _ = require('underscore');
// 函数式编程，库，抹平了集合操作得差异性，jQuery抹平了浏览器得差异性
// _.each([1,2,3], console.log);
// _.each({one:  1, two: 2, three: 3}, console.log);
// var sum = _.reduce([1,2,3], function(memo, num) {
//     return memo + num;
// });
// console.log(sum);

// var list = [[0,1],[2,3],[4,5]];
// var flat = _.reduceRight(list, function(a, b) {
//     console.log(`a${a}, b${b}`);
//     return a.concat(b);
// }, []);
// console.log(flat);

// console.log(_.first([5,4,3,2,1], 2));
// console.log(_.flatten([1,[2],[3,[[4]]]], true));

// var compiled = _.template('hello: <%= name %>');
// console.log(compiled({name: 'moe'}));

// var hello = function(name) {
//     return `hello: ${name}`;
// }
// hello = _.wrap(hello, function(func) {
//     return `before, ${func('moe')}, after`;
// });
// console.log(hello());

var object = {
    parent: {
        child1: {
            child2: {
                child3: '我是第三代'
            }
        }
    }
}
// console.log(_.result(object, 'child1'));
var stooge = {name: 'moe'};


function ctor(){
    return function() {}
}

function baseCreate(prototype){
    var Ctor = ctor();
    Ctor.prototype = prototype;
    // result的__proto__指针指向其构造函数的prototype
    var result = new Ctor;
    // 这一步看不懂
    Ctor.prototype = null;
    return result;
}

var a = baseCreate({name: 'ywj'});
function has(obj, has) {
}
const obj = { selector: { to: { toutiao: 'FE coder' } }, target: [1, 2, { name: 'byted' }] };// 运行代码
// _.get(obj, 'selector.to.toutiao', 'target[0]', 'target[2].name')
// console.log(_.has(object, 'parent'));
// console.log(_.has(object, 'child1'));
// console.log(_.has(object, ['parent', 'child1']));

// 看着向什么呢，格式化参数，如果函数传入的参数个数是不确定的，那么就将多余的参数保存到一个数组中，传入最后一个参数
// 模拟rest参数 剩余参数语法允许我们将一个不定数量的参数表示为一个数组
// function(a, b, ...theArgs) {} 剩余参数由函数的实际参数提供
// arguments对象包含了传给函数的所有实参，剩余参数只包含那些没有对应形参的实参
// 剩余参数是一个真正的数组，可以使用数组的方法，arguments对象是一个类数组对象，使用数组的方法需要首先转换成数组，这就引入了样板代码
// 剩余参数引入的目的：减少由参数引起的样板代码
// 模拟剩余参数
var raceResults = _.restArguments(function(gold, silver, bronze, everyoneElse) {
    // _.each(everyoneElse, sendConsolations);
    console.log(arguments);
});
function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
        var length = Math.max(arguments.length - startIndex, 0),
            rest = Array(length),
            index = 0;
        for (; index < length; index++) {
            rest[index] = arguments[index + startIndex];
        }
        var args = Array(startIndex + 1);
        for (index = 0; index < startIndex; index++) {
            args[index] = arguments[index];
        }
        args[startIndex] = rest;
        return func.apply(this, args);
    }
}
var delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
        return func.apply(null, args);
    }, wait);
});

function debounce(func, wait, immediate) {
    var timeout, result;
    var later = function(context, args) {
        timeout = null;
        if (args) result = func.apply(context, args);
    };

    // 本质：需要防抖的函数延迟执行，如果有新的函数进来，取消上一个函数，重新设置一个新的函数
    // 函数不立即执行，再一段间隔内执行，但是这个间隔不是固定的（节流的时间间隔是固定的）
    // 
    var debounced = restArguments(function(args) {
        // 清掉上一个
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 控制再一个时间间隔中不重复执行
            var callNow = !timeout;
            // later和callNow通过timeout解决互斥问题，两个只能执行1个
            // 互斥的策略
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(this, args);
        } else {
            // 再设置一个新的
            timeout = delay(later, wait, this, args);
        }
        return result;
    });

    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };
    return debounced;
}
// raceResults("Dopey", "Grumpy", "Happy", "Sneezy", "Bashful", "Sleepy", "Doc");
function print(msg) {
    console.log('函数执行', msg);
}
// var dPrint = debounce(print, 2000, true);
// dPrint(1);
// dPrint(2);
// dPrint(3);
// dPrint(4);
// setTimeout(function() {
//     dPrint(5);
// }, 3000);
// setTimeout(function() {
//     dPrint(6);
// }, 0);

var hello = function(name) {return 'hello: ' + name; };
hello = _.wrap(hello, function(func, name) {
    // 钩子——生命周期钩子
    return 'before, ' + func(name) + ', after';
});
// console.log(hello('ywj'));

var subtract = function(a, b) { return b - a; };
sub5 = _.partial(subtract, 5);
sub5(20);

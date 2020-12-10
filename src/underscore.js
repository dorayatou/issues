// 函数式编程局部应用（partial Application）和局部套用（Currying）的区域

const { eq } = require("lodash");

[2,3,4].map(n => {
    return n * n;
});
[1,4,7,6].map(n => {
    return n * n;
});
// 函数(n) => return n * n; 定义两次，写了两次，可以预见，使用几次就需要定义几次，如果函数体比较大，代码重复量更大

// 假如有一个函数只接收数组就返回对应的值，那么代码量将减少
// unaryFn 一元函数er
// map有两个参数，称其为二元函数
function map(list, unaryFn) {
    return [].map.call(list, unaryFn);
}
// 函数抽取成一个单独的函数
// unaryFn 一元函数er
function square(n) {
    return n * n;
}

// 二元函数变成两个一元的层叠函数
function mapWith(unaryFn) {
    return function(list) {
        return map(list, unaryFn);
    }
}

// 局部应用
// var squareAll = mapWith(square);
// console.log(squareAll([2,3,4]));
// console.log(squareAll([4,5,6]));

// 局部应用到局部套用(套用map)
function wrapper(secondArg) {
    return function(firstArg) {
        // binary 二元函数，接受两个参数
        return binaryFn(firstArg, secondArg);
    }
}

function rightmostCurry(binaryFn) {
    return function(secondArg) {
        return function(firstArg) {
            return binaryFn(firstArg, secondArg);
        }
    }
}

// var rightmostCurriedMap = rightmostCurry(map);
// var squareAll = rightmostCurriedMap(square);
// console.log(squareAll([2,3,4]));
// console.log(squareAll([4,5,6]));

// ES6  spread operator(扩展操作) / rest parameters(剩余参数) 
// 函数转换成它的柯里化版本，而不是写出每一个函数的柯里化版本
// function curry(fn) {
//     return function curried() {
//         var args = [].slice.call(arguments);
//         return args.length >= fn.length ?
//             fn.apply(null, args) :
//             function() {
//                 var rest = [].slice.call(arguments);
//                 return curried.apply(null, args.concat(rest));
//             };
//     }
// }

// 上一个版本的curry不能保存函数上下文，这在具有函数的柯里化中有问题，下面式对其的改良
// function curry(fn) {
//     return function curried() {
//         var args = toArray(arguments),
//             context = this;
//         return args.length >= fn.length ?
//             fn.apply(context, args) :
//             function() {
//                 var rest = toArray(arguments);
//                 return curried.apply(context, args.concat(rest));
//             };

//     }
// }

// 上一版本的函数，实现了在调用时正确地保留了上下文，但是curried函数只能接受原始函数声明时的参数数量
// 对于具有可选的声明参数或可变数量的参数，没办法柯里化
// Javascript允许任何函数都是可变的，所以何时对原始函数求值不好把控，所以实现能够处理所有情况的curry函数可能是无效的
// 综上：如果使用一元函数和二元函数进行函数式编程，而这些函数有具体的参数声明的话，可以充分利用柯里化的优势。

// ES6中的函数curry和apply
// function curry(fn) {
//     return function(...args) {
//         return args.length >= fn.length ?
//             fn.call(this, ...args) :
//             (...rest) => {
//                 return curried.call(this, ...args, ...rest);
//             };
//     }
// }

// function apply(fn, ...args) {
//     return (..._args) => {
//         return fn(...args, ..._args);
//     };
// }

// predicate 断言函数 操作抽象成一个函数时，可以使用currying（柯里化）构建一个更有用的函数
// currying(柯里化)是使一个具有N个参数的函数，返回一个N个函数的嵌套系列，每个函数都采用1个参数
// 函数的参数从右向左进行柯里化，rightCurry
// 函数的参数从左向右进行柯里化，leftCurry


function flip(fn) {
    return function() {
        var args = [].slice.call(arguments);
        return fn.apply(this, args.reverse());
    }
}
function rightCurry(fn, n) {
    var arity = n || fn.length,
        fn = flip(fn);
    return function curried() {
        var args = [].slice.call(arguments),
            context = this;
        return args.length >= arity ?
            fn.apply(context, args.slice(0, arity)) :
            function() {
                var rest = [].slice.call(arguments);
                return curried.apply(context, args.concat(rest));
            };
    };
}
function filter(list, fn) {
    return list.filter(fn);
}

var filterWidth = rightCurry(filter);

var list = [1,2,3,4,5,6,7,8,9,10];
var justEvens = filterWidth(function(n) {return n % 2 === 0;});
console.log(justEvens(list));

function greaterThanOrEqual(a, b) {
    return a >= b;
}
var greatherThanOrEqualTo = rightCurry(greaterThanOrEqual);
var list1 = [5,3,6,2,8,1,9,4,7],
    fiveOrMore = greatherThanOrEqualTo(5);
console.log(filterWidth(fiveOrMore)(list1));

// 函数式编程如何抽象，达到复用的目的

function useWith(fn /*, txfn, ... */) {
    var transforms = [].slice.call(arguments, 1),
        _transform = function(args) {
            return args.map(function(arg, i) {
                return transforms[i](args);
            });
        };
    return function() {
        var args = [].slice.call(arguments),
            targs = args.slice(0, transforms.length),
            remaining = args.slice(transforms.length);
        return fn.apply(this, _transform(targs).concat(remaining));
    }
}

// 偏应用函数
const partial = (f, ...args) => {
    return (...moreArgs) => {
        return f(...args, ...moreArgs);
    }
}

const add3 = (a, b, c) => a + b + c;
const fivePlus = partial(add3, 2, 3);
console.log(fivePlus(4));

const compose = (f, g) => (a) => f(g(a));
const floorAndToString = compose((val) => val.toString(), Math.floor);
console.log(floorAndToString(123.123));

function isEqual(a, b) {
    return eq(a, b);
}

// js有两种比较方式
// 严格比较运算符: 两个操作数类型相同且值相等为true
// 转换类型比较运算符:比较之前，两个操作数转换成相同的类型
function eq(a, b, aStack, bStack) {
}


// 继承模式



var ObjProto = Object.prototype;
var hasOwnProperty = ObjProto.hasOwnProperty;
function has(obj, path) {
    return obj != null && hasOwnProperty.call(obj, key);
}
function has$1(obj, path) {
    if (!isArray(path)) {
        return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
        var key = path[i];
        if (obj === null || !hasOwnProperty.call(obj, key)) {
            return false;
        }
        obj = obj[key];
    }
    return !!length;
}

function deepGet(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
        if (obj === null) return void 0;
        obj = obj[path[i]];
    }
    // 换成while循环
    // while (obj && i < length) {
    //     obj = obj[path[i++]];
    // }
    // if (obj === null) return void 0;
    return length ? obj : void 0;
}

// 返回一个在[10, 100)之间的随机数
function random(min, max) {
    Math.random(); // [0, 1)
    // 1、当Math.random()随机为0时，返回min
    // 2、返回趋向于max，即max + 0(不等于0，应该时大于0),即Math.random()随机到
    // (1 - Math.random()) -> 0,Math.random() -> 1, Math.random() * max + (1 - Math.random()) * min
    // (Math.random() * (max - min)) + min
    Math.random() * (max - min) + min; // 随机的是浮点数
    // 随机整数，如果min是浮点数，随机的整数是大于min的整数，即Math.ceil(min)
    // 而如果max是浮点数，随机的整数是小于max的整数，即Math.floor(max)
    min = Math.ceil(min);
    max = Math.floor(max);
    Math.floor(Math.random() * (max - min)) + min; // [min, max)
    Math.floor(Math.random() * (max - min + 1)) + min; // [min, max];
}

// 函数节流：限定每隔一段时间执行
// 采用的技术是什么？本质采用定时器
function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
        previous = options.leading  === false ? 0 : now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    var throttled = function() {
        var _now = now();
        if (!previous && options.leading === false) previous = _now;
        var remaining = wait - (_now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailling !== false){
            timeout = setTimeout(later, remaining);
        }
        return result;
    }
    throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };
    return throttled;
}
// 返回func的一个版本，该函数版本在调用时接收来自startIndex的所有参数
// 如果未传递显式的startIndex，通过查看func本身的参数来确定
// 参数收集到单个数组中
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
// 函数防抖: 已最近一次（最后一次）的操作为准
// 先说函数防抖，debounce。其概念其实是从机械开关和继电器的“去弹跳”（debounce）衍生出来的，基本思路就是把多个信号合并为一个信号。
// 节流的概念可以想象一下水坝，你建了水坝在河道中，不能让水流动不了，你只能让水流慢些。换言之，你不能让用户的方法都不执行。如果这样干，就是debounce了。
// 为了让用户的方法在某个时间段内只执行一次，我们需要保存上次执行的时间点与定时器。
// 函数防抖技术本质是什么？ 定时器，巧用setTimeout做缓存池，可以清除待知晓的代码
// immediate控制函数再整个抖动过程中（一个间隔中）执行的位置
// 再一个时间间隔内wait，函数总共执行1次，无论调用多少次
// 防抖可能引起函数执行结果不一样，是为了提高性能使用的，应用场景
// 关注最终状态 各个中间状态一样，比如提交按钮
function debounce(func, wait, immediate) {
    var timeout, result;
    var later = function(context, args) {
        timeout = null; // 开锁
        if (args) result = func.apply(context, args);
    };

    // 本质：需要防抖的函数延迟执行，如果有新的函数进来，取消上一个函数，重新设置一个新的函数
    // 函数不立即执行，再一段间隔内执行，但是这个间隔不是固定的（节流的时间间隔是固定的）
    // 
    var debounced = restArguments(function(args) {
        // 清掉上一个,虽然timeout被clear了，但是timeout变量还是存在的
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 控制再一个时间间隔中不重复执行
            var callNow = !timeout; // 锁
            // later和callNow通过timeout解决互斥问题，两个只能执行1个
            // 互斥的策略：setTimeout设置的later执行后设置timeout，控制权给到下面
            // 这里需要去了解一下操作系统互斥，锁的运用
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

function memoize(func, hasher) {
    var memoize = function(key) {
        var cache = memoize.cache;
        var address = '' + (hasher ? hasher.apply(this, arguments) : key);
        if (!has(cache, address)) cache[address] = func.apply(this, arguments);
        return cache[address];
    };
    memoize.cache = {};
    return memoize;
}

function compose() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
        var i = start;
        var result = args[start].apply(this, arguments);
        while(i--) {
            result = args[i].call(this, result);
        }
        return result;
    };
}

var patial = restArguments(function(func, boundArgs) {
    var placeholder = partial.placeholder;
    var bound = function() {
        
    };
    return bound;
});
function wrap(func, wrapper) {
    return partial(wrapper, func);
}

function debounce(func, delay) {
    let timeout;
    return function(e) {
        clearTimeout(timeout);
        var context = this, args = arguments;
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, delay);
    }
}
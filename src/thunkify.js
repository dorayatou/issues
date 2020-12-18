const fs = require('fs');

// fn代表要thunify的函数
// 需要三个函数返回，一个函数用于处理参数，第二个函数用于处理回调
function thunkify(fn) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        var ctx = this;
        // done代表回调函数
        return function(done) {
            var called;
            args.push(function() {
                if (called) return;
                called = true;
                done.apply(null, arguments);
            });
            try {
                fn.apply(ctx, args); // 此时才真正的执行的文件操作函数,异步函数执行在这里
            } catch (err) {
                done(err);
            }
        }
    }
}

// 此时只是将函数通过thunkify处理一下，直接返回一个新函数
// 将回调函数放到最后一个参数，符合api规范
// 真正的api调用依然是 fs.readFile('./test.txt', 'utf-8', function(err, data) {});
// 可以看到fs.readFile函数是包含回调函数的多参数情况，真正调用底层api的方法并没有改变，但是在代码层的编写方式改变了
// var readFile = thunkify(fs.readFile);
// var dataFn = readFileThunk('./test.txt', 'utf-8');
// 此时其实真正使用函数的地方还没到，依然返回一个函数
// readFile('./test.txt', 'utf-8')((err, data) => {
//     if (err) {
//         console.error(err);
//     }
//     console.log(data);
// });
var readFile = function(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, function(error, data) {
            if (error) reject(error);
            resolve(data);
        });
    });
}

var gen = function* () {
    var r1 = yield readFile('./test.txt'); // 此时yield出来的是一个函数，函数可以接收参数，调用
    console.log(r1);
    var r2 = yield readFile('./test2.txt');
    console.log(r2);
}

// var g = gen();
// var r1 = g.next();
// r1.value(function(err, data) {
//     if (err) {
//         throw err;
//     }
//     var r2 = g.next(data);
//     console.log(r2);
//     r2.value(function(err, data) {
//         if (err) {
//             throw err;
//         }
//         g.next(data);
//     });
// });

// Generator函数的自动执行器
// 自动执行的关键是，必须有一种机制，自动控制Generator函数的流程，接收和交还程序的执行权
// Generator函数就是一个异步操作的容器，它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权
// 两种方法可以做到这一点
// 1、回调函数。将异步操作包装成Thunk函数,在回调函数里面交回执行权（thunk返回函数，函数可以接收回调函数）
// 2、Promise对象。将异步操作包装成Promise对象，用then方法交回执行权(then方法可以交回执行权)
function run(fn) {
    var gen = fn();
    function next(err, data) {
        console.log('data', data);
        var result = gen.next(data);
        if (result.done) return;
        result.value(next);
    }
    next();
}
// run(gen);
// function load(fn) {
//     fn(null, this.name);
// }

// var user = {
//     name: 'tobi',
//     load: thunkify(load)
// };

// user.load()




// var g = gen();
// g.next().value.then(function(data) {
//     g.next(data).value.then(function(data) {
//         g.next(data);
//     });
// });

function run(gen) {
    var g = gen();
    function next(data) {
        var result = g.next(data);
        if (result.done) return result.value;
        result.value.then(function(data) {
            next(data);
        });
    }
    next();
}
run(gen);

// function co(gen) {
//     var ctx = this;
//     return new Promise(function(resolve, reject) {
//         if (typeof gen === 'function') gen = gen.call(ctx);
//         if (!gen || typeof gen.next !== 'function') return resolve(gen);
//         onFulfilled();
//         function onFulfilled(res) {
//             var ret;
//             try {
//                 ret = gen.next(res);
//             } catch (e) {
//                 return reject(e);
//             }
//             next (ret);
//         }

//         function next(ret) {
//             if (ret.done) return resolve(ret.value);
//             var value = toPromise.call()
//         }
//     });
// }

/**
 * 1、高阶函数，函数的参数是一个函数或者函数返回一个函数
 * 2、高阶组件，一个组件返回另外一个组件
 * 闭包：函数定义的作用域（词法作用域）和执行的作用域（函数调用栈）不一致的时候会产生闭包
 * 2、柯里化和反柯里化，格式化函数的参数
 */

 /**
  * 
  * @param {*} fn 需要柯里化的函数
  * @param {*} arr 函数fn参数收集
  */
 const currying = (fn, arr = []) => {
    let len = fn.length; // fn的形参个数
    return (...args) => { // ...剩余参数收集，此时args是一个数组
        let concatArgs = [...arr, ...args]; // ...扩展运算符
        if (concatArgs.length < len) { // 如果当前的参数小于fn的参数个数，说明fn的参数不够，需要继续柯里化
            return currying(fn, concatArgs);
        } else {
            fn(...concatArgs); // ...扩展运算符，将concatArgs数组的参数逐个传入fn
        }
    }
 }


/**
 * 高阶函数增强原函数功能
 */

 function say(a, b) {
     console.log('hello', a, b);
 }

 Function.prototype.before = function(cb) {
     return (...args) => {
        cb();
        this.call(null, ...args);
     };
 }
 let say1 = say.before(function() {
     console.log('before');
 });

 say1(1,2);
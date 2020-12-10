const async = require('async');

function doOne(callback) {
    console.log('one-outer');
    setTimeout(() => {
        console.log('one-begin');
        callback(null, 'one');
    }, 2000);
}
// const doOne = callback => {
//     setTimeout(() => {
//         callback(null, 'one');
//     }, 1000);
// };

// function doTwo(arg, callback) {
//     console.log('two-outer');
//     setTimeout(() => {
//         console.log('two-begin', arg);
//         callback(null, arg + '-' + 'two');
//     }, 2000);
// }
const doTwo = (callback) => {
    console.log('two-outer');
    setTimeout(() => {
        console.log('two-begin');
        callback(null, 'two');
    }, 1000);
};

let array = [];
array.push(doOne);
array.push(doTwo);

// async.parallel(array, (err, result) => {
//     console.log('result', result);
// });

async.series(array, (err, result) => {
    console.log('result', result);
});

// async.waterfall(array, (err, result) => {
//     // 这个result是最后一步产生的值
//     console.log('result', result);
// });

// 实现一个waterfall功能
// 对于任务，任务只会执行一次，执行完后销毁？出于什么目的？
function noop() {};
function once(fn) {
    return function() {
        if (fn === null) return;
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    }
}
function onlyOnce(fn) {
    return function() {
        if (fn === null) throw new Error('Callback was already called.');
        var callFn = fn;
        fn = null;
        callFn.call(this, arguments);
    }
}
function fallback(fn) {
    setTimeout(fn, 0);
}
var _defer;
if (hasSetImmediate) {
    _defer = setImmediate;
} else if (hasNextTick) {
    _defer = process.nextTick;
} else {
    _defer = fallback;
}
function wrap(defer) {
    return function(fn/*, ...args*/) {
        var args = slice(arguments, 1);
        defer(function() {
            fn.apply(null, args);
        });
    }
}
var setImmediate$1 = wrap(_defer);
// 给一个函数预绑定多个参数并返回一个可以直接调用的新函数，可以简化代码
var apply = function(fn/*, ...args*/) {
    var args = slice(arguments, 1);
    return function(/*callArgs*/) {
        var callArgs = slice(arguments);
        return fn.apply(null, args.concat(callArgs));
    };
}
// 目前分析不出来这个函数的作用：猜测是为了格式化fn调用的参数
// 以后调用fn就不需要在参数内部处理args和callback的处理了
// 让fn的参数规范化,形如fn(x[,y,z], callback)
// fn接收参数的格式[args,callback]，但是该函数呢返回一个新函数
// 返回一个函数，可以传多个参数，只要最后一个参数是callback就行
var initialParams = function(fn) {
    return function(/*...args, callback*/) {
        var args = slice(arguments);
        var callback = args.pop();
        fn.call(this, args, callback);
    }
}
function memoize(fn, hasher) {
    var memo = Object.create(null);
    var queues = Object.create(null);
    hasher = hasher || identity;
    var _fn = wrapAsync(fn);
    var memoized = initialParams(function memoized(args, callback) {
        var key = hasher.apply(null, args);
        if (has(memo, key)) {
            setImmediate$1(function() {
                callback.apply(null, memo[key]);
            });
        } else if (has(queues, key)) {
            queues[key].push(callback);
        } else {
            queues[key] = [callback];
            _fn.apply(null, args.concat(function() {
                var args = slice(arguments);
                memo[key] = args;
                var q = queues[key];
                delete queues[key];
                for (var i = 0, l = q.length; i < l; i++) {
                    q[i].apply(null, args);
                }
            }));
        }
    });
    memoized.memo = memo;
    memoized.unmemoized = fn;
    return memoized;
}
// &&操作符的作用是，如果第一个操作数的值为真，则返回第二个操作数的值
// 如果第一个操作数的值为false，则返回false。这种写法能实现判断某个参数是否存在，如果存在则返回的作用
var hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
var hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';
var supportsSymbol = typeof Symbol === 'function';
// 判断是否是async定义的函数
function isAsync(fn) {
    return supportsSymbol && fn[Symbol.toStringTag] === 'AsyncFunction';
}

function wrapAsync(asyncFn) {
    return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
}
// 就是模板代码，按照某种格式柯里化函数的参数，所谓的初始化参数过程
var initialParams = function(fn) {
    // 可以接收任意数量个数的参数，但是参数的格式应该是最后一个是callback
    return function(/*...args, callback*/) {
        var args = slice(arguments);
        var callback = args.pop();
        fn.call(this, args, callback); // 这一句其实就是async中initialParams中传递的函数
    }
}
// func函数签名的格式是function(x[,y,z], callback);
// asyncify要将func这个异步函数处理一下，异步函数的遵循规范包装一下，异步函数最后一个参数是callback
// 异步函数接收一个回调函数，回调函数是处理异步任务的一种方案
// 所以如何处理异步，首先确定方案
function asyncify(func) {
    // 通过initialParams格式化外部函数func的参数
    return initialParams(function(args, callback) {
        var result;
        try {
            result = func.apply(this, args);
        } catch (e) {
            return callback(e);
        }
        if (isObject(result) && typeof result.then === 'function') {
            result.then(function(value) {
            }, function(err) {
            });
        } else {
            callback(null, result);
        }
    });
}// 返回一个函数，这个函数是对func的包装
var asyncLoad = asyncify($.load);
$.load(URL, data, callback);
// asyncParse(a, b, callback) // 可以这种方式调用
try {
    asyncLoad('url', {a: 1, b:2}, fn);
} catch (e) {

}

// 错误是如何冒泡的？如何冒泡，不停的调用同一个方法
// 场景，冒泡原理应该是一种传递机制
function rethrow(error) {
    throw error;
}

function invokeCallback(callback, error, value) {
    try {
        // 将错误传递给回调函数，如果回调函数里没有处理error
        // 回调函数内部就会报错，错误抛向全局
        callback(error, value);
    } catch(e) {
        setImmediate(rethrow, e);
    }
}

// race的本质是封装一个once函数
function race(tasks, callback) {
    callback = once(callback || noop);
    if (!isArray(tasks)) return callback(new TypeError('第一个参数必须是数组'));
    if (!tasks.length) return callback();
    for (var i = 0, l = tasks.length; i < l; i++) {
        wrapAsync(tasks[i])(callback);
    }
}

// 执行完第一个任务，将结果带到下一个任务中，执行下一个任务
// 当所有任务都执行完，将结果带给callback, 执行callback
// 处理异常，处理异常的策略
// 每一个任务都要接收一个callback,，用于将结果输出给下一个函数
// 上一个任务的执行结果如何传到下一个任务中?
// 如果将任务包装成迭代器，然后再来一个调度器，按顺序调度任务
function A() {
    return res;
}
function B(res) {
    return res + 'B';
}
function C(res) {
    return res + 'C';
}
// 怎么我理解的框架应该包装一个每一个任务
// function wrapA() {
//     var result = A();
//     // nexTask流转到框架里，执行下一个任务，并将result传递给wrapB
//     nextTask(result);
// }
// waterfall([
//     A,
//     B,
//     C
// ], callback);
// 这个版本好像是新版本里面的源码实现
var waterfall = function(tasks, callback) {
    callback = once(callback || noop);
    // callback的调用遵循error-first的方式
    if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
    if (!tasks.length) return callback();
    // 指向下一个将要执行的函数
    var taskIndex = 0;

    // 调用用户指定的task->fn
    // function _run(index, args, cb) {
    //     var task = tasks[index];
    //     args.push(cb);
    //     task.apply(null, args);
    // }

    // 用户态的函数执行,涉及到用户态转移到框架态，通过next传递控制权
    // async-await底层通过协程的方式处理用户态和框架态的转移，是如何实现的呢？
    function nextTask(args) {
        // 如果是异步任务，则包装一下，回调需要传递过去，达到某个任务执行完后能够执行callback
        // 如果是同步任务，wrapAsync返回原任务
        var task = wrapAsync(tasks[taskIndex++]);
        // 参数，给参数中封入框架的next，保证当前任务执行完后能够继续下一个任务
        args.push(onlyOnce(next));
        // 执行任务
        task.apply(null, args);
    }

    // 用于控制流的转移，用户态到框架态
    // 1、控制流的使者就是_cb
    // 2、框架转移到用户：调用用户函数的同时，把_cb当作参数传递
    // 3、用户转移到框架：用户调用_cb函数，表明已执行完该函数，把控制交给框架。框架处理结束或者框架处理执行下一个函数
    // function _cb() {
    //     if (arguments[0] || taskIndex === tasks.length) {
    //         return callback && callback.apply(null, arguments);
    //     }
    //     var rest = [].slice.call(arguments, 1); // 第一个参数是null或者用户抛出的错误,剩余参数代表用户传入到下一个任务的参数，也是此处task的结果
    //     _run(taskIndex++, rest, _cb);
    // }

    // 其实这个函数是用户定义的第一个函数执行最后的callback(null, 1, 2);
    function next(err) {
        // 框架层处理异常||任务执行完毕||执行下一个任务的情况
        if (err || taskIndex === tasks.length) {
            return callback.apply(null, arguments); // 此处的arguments是callback内部的所有参数，包括第一个参数
        }
        nextTask(slice(arguments, 1)); // 第一个参数默认是error,将结果以参数的形式传递到下一个任务中
    }

    // if (tasks.length === 0) return callback && callback();
    // _run(taskIndex++, [], _cb);
    // 结果收集在数组中,waterfall的一个典型特征就是上一个任务的输出结果会作为下一个任务的输入参数
    nextTask([]);
}
// 尝试实现第二个版本的waterfall
var waterfallTwo = function(tasks, callback) {
    callback = once(callback || noop);
    // callback的调用遵循error-first的方式
    if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
    if (!tasks.length) return callback();
    // 指向下一个将要执行的函数
    var taskIndex = 0;

    // 用户态的函数执行,涉及到用户态转移到框架态，通过next传递控制权
    // async-await底层通过协程的方式处理用户态和框架态的转移，是如何实现的呢？
    function nextTask(args) {
        // 如果是异步任务，则包装一下，回调需要传递过去，达到某个任务执行完后能够执行callback
        // 如果是同步任务，wrapAsync返回原任务
        // var task = wrapAsync(tasks[taskIndex++]);
        // 参数，给参数中封入框架的next，保证当前任务执行完后能够继续下一个任务
        // args.push(onlyOnce(next));
        // 执行任务,如果任务是同步执行的
        // task.apply(null, args);
        
        // 如果任务是同步任务
        var task = tasks[taskIndex++]; // 取到当前任务，并且将任务索引更新
        var taskResult = task.apply(null, args);
        next(null, taskResult);
        // 如果是异步任务的化，next需要在任务内部调用，所以需要将next当作参数传递给用户态的函数中
        // 这是通过回调的方式处理异步
        // 回调的方式处理的缺陷就是控制权给了用户，需要用户在定义任务的时候按照规范处理。回调的方式统一化
        var task = wrapAsync(tasks[taskIndex++]);
        args.push(onlyOnce(next));
        task.apply(null, args); // 如果函数是异步函数，task执行完毕的时候未必就可以拿到结果了，需要拿到结果后传递next
        // 如果不用回调的方式，用promise如何呢？promise也可以同一化同步任务和异步任务，该如何实现？
        // 这种就要求用户态定义的任务按照promise返回，这好像又添加了另外一个限制，但不是不能实现
        taskPrimise.then(res => {
            next(null, res);
        }, reason => {
            next(reason);
        });
    }

    // 用于控制流的转移，用户态到框架态
    // 1、控制流的使者就是_cb
    // 2、框架转移到用户：调用用户函数的同时，把_cb当作参数传递
    // 3、用户转移到框架：用户调用_cb函数，表明已执行完该函数，把控制交给框架。框架处理结束或者框架处理执行下一个函数
    // function _cb() {
    //     if (arguments[0] || taskIndex === tasks.length) {
    //         return callback && callback.apply(null, arguments);
    //     }
    //     var rest = [].slice.call(arguments, 1); // 第一个参数是null或者用户抛出的错误,剩余参数代表用户传入到下一个任务的参数，也是此处task的结果
    //     _run(taskIndex++, rest, _cb);
    // }

    // 其实这个函数是用户定义的第一个函数执行最后的callback(null, 1, 2);
    function next(err) {
        // 框架层处理异常||任务执行完毕||执行下一个任务的情况
        if (err || taskIndex === tasks.length) {
            return callback.apply(null, arguments); // 此处的arguments是callback内部的所有参数，包括第一个参数
        }
        nextTask(slice(arguments, 1)); // 第一个参数默认是error,将结果以参数的形式传递到下一个任务中
    }

    // if (tasks.length === 0) return callback && callback();
    // _run(taskIndex++, [], _cb);
    // 结果收集在数组中,waterfall的一个典型特征就是上一个任务的输出结果会作为下一个任务的输入参数
    nextTask([]);
}
// 迭代器管理任务（函数数组）
// 我想实现一个任务迭代器，执行完上一个任务，自动执行下一个任务，当执行到最后一个任务后，执行传入的回调

function DLL() {
    this.head = this.tail = null;
    this.length = 0;
}

DLL.prototype.removeLink = function(node) {
    if (node.prev) {
        node.prev.next = node.next;
    } else {
        this.head = node.next;
    }
    if (node.next) {
        node.next.prev = node.prev;
    } else {
        this.tail = node.prev;
    }
    node.prev = node.next = null;
    this.length -= 1;
    return node;
}
DLL.prototype.insertAfter = function(node, newNode) {
    newNode.prev = node;
    newNode.next = node.next;
    if (node.next) {
        node.prev.next = newNode;
    } else {
        this.tail = newNode;
    }
    node.next = newNode;
    this.length += 1;
}
DLL.prototype.insertBefore = function(node, newNode) {
    newNode.prev = node.prev;
    newNode.next = node;
    if (node.prev) {
        node.prev.next = newNode;
    } else {
        this.head = newNode;
    }
    node.prev = newNode;
    this.length += 1;
}
DLL.prototype.empty = function() {
    while(this.head) {
        this.shift();
    }
    return this;
}
DLL.prototype.push = function(node) {
    if (this.tail) {
        this.insertAfter(this.tail, node);
    } else {
        setInitial(this, node);
    }
}
DLL.prototype.pop = function() {
    return this.tail && this.removeLink(this.tail);
}
DLL.prototype.shift = function() {
    return this.head && this.removeLink(this.head);
}
DLL.prototype.unshift = function(node) {
    if (this.head) {
        this.insertBefore(this.head, node);
    } else {
        setInitial(this, node);
    }
}
DLL.prototype.toArray = function() {
    var arr = Array(this.length);
    var curr = this.head;
    for (var idx = 0; idx < this.length; idx++) {
        arr[idx] = curr.data;
        curr = curr.next;
    }
    return arr;
}
function setInitial(dll, node) {
    dll.length = 1;
    dll.head = dll.tail = node;
}

function queue(worker, concurrency, payload) {
    if (concurrency == null) {
        concurrency = 1;
    } else if (concurrency === 0) {
        throw new Error('Cincurrency must not be zero');
    }
    var _worker = wrapAsync(worker);
    var numRunning = 0;
    var workersList = [];
    var processingScheduled = false;
    function _insert(data, insertAtFront, callback) {
        q.started = true;

    }
    function _next(tasks) {}
    var isProcessing = false;
    var q = {
        _tasks: new DLL(),
        concurrency: concurrency,
        payload: payload,
        saturated: noop,
        unsaturated:noop,
        buffer: concurrency / 4,
        empty: noop,
        drain: noop,
        error: noop,
        started: false,
        paused: false,
        push: function(data, callback) {
            _insert(data, false, callback); // 对尾插入
        },
        unshift: function(data, callback) {
            _insert(data, true, callback); // 对头插入
        },
        process: function() {
            if (isProcessing) {
                return;
            }
            isProcessing = true;
            while(!q.paused && numRunning < q.concurrency && q._tasks.length) {
                var tasks = [], data = [];
                var l = q._tasks.length;
                if (q.payload) l = Math.min(l, q.payload);
                for (var i = 0; i < l; i++) {
                    var node = q._tasks.shift();
                    tasks.push(node);
                    workersList.push(node);
                    data.push(node.data);
                }
            }
            isProcessing = false;
        }
    };
    return q;
}

function cargo(worker, payload) {
    // 并发为1，一个任务单元的负载为payload
    return queue(worker, 1, payload);
}
// 判断value是类数组对象，类数组对象的特征是具有length属性，并且不是函数
function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}
var MAX_SAFE_INTEGER = 9007199254740991;
// 取模运算是一种倍数关系，对1取模是0代表是整数
function isLength(value) {
    return typeof value === 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
// Object没有默认的迭代器，需要自己实现一个
var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;
// 获取集合coll的迭代器
function getIterator(coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
}
// 迭代器的应用层数据
function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    return function next() {
        return ++i < len ? {value: coll[i], key: i} : null;
    }
}
// 应用层数据的封装，因为迭代器返回的迭代对象格式是{value: 'xxx', done: true/false}
// 而实际使用的地方一般是值和key
// createArrayIterator\createObjectIterator\createES2015Iterator都是这个作用
function createObjectIterator(coll) {
    var okeys = keys(obj);
    var i = -1;
    var len = okeys.length;
    return function next() {
        var key = okeys[++i];
        return i < len ? {value: obj[key], key: key} : null;
    }
}
function createES2015Iterator(iterator) {
    var i = -1;
    return function next() {
        var item = iterator.next();
        if (item.done) {
            return null;
        }
        i++;
        return {value: item.value, key: i};
    }
}
// 统一不同对象格式的迭代器
function iterator(coll) {
    if(isArrayLike(coll)) {
        return createArrayIterator(coll); // 如果是数组对象，手动实现迭代器对象
    }
    var iterator = getIterator(coll);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
// 给字符串部署一个迭代器
// 迭代器，内部有个指针自动向后移动，迭代器是一种模式
function createStrAutoIterator(str) {
    // 字符串原生支持了迭代器，不需要开发者自己实现，直接用原生的迭代器
    var iterator = getIterator(str);
    // 闭包保存了一个变量i，控制迭代中的当前顺序
    var i = -1;
    return function next() {
        var item = iterator.next(); // 原生部署的迭代器通过调用next方法拿到值
        if (item.done) {
            return null;
        }
        i++; // i不是必须，返回值不需要的话就不需要。但是迭代器中一般要使用数据的索引位置
        return item.value;
    }
}
let str = 'AB#D##CE##F###';

var getNextData = createStrAutoIterator(str);

// 迭代器的实现原理：闭包，内部维护变量i，控制变量的增加，返回包含next函数的对象
// 并且调用next韩素，返回符合迭代器协议的对象格式{value: 'xxx', done: true/false}
// next内部迭代结束，不再返回新值，返回{value: undefined, done: false}
// 下面是给object对象实现一个迭代器对象和迭代器协议
var iterable = {
    a: function() {},
    [Symbol.iterator]() {
        return {
            i: -1,
            next() {
                // 迭代器内部实现
                if (this.i < 3) {
                    return { value: this.i++, done: false };
                }
                return { value: undefined, done: true };
            }
        }
    }
}


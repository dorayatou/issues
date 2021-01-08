// 图片请求封装promise
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            resolve(image);
        };
        image.onerror = reject;
        image.src = src;
        // document.body.appendChild(image);
    });
}

loadImage('../static/1.jpg').then(img => {
    img.style.border = '1px solid red';
})

loadImageAsync.then(() => {

})

// ajax请求封装promise
const getJSON = function(url) {
    return new Promise(function(resolve, reject) {
        const handler = function() {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
        const client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = handler;
        client.responseType = 'json';
        client.setRequestHeader('Accept', 'application/json');
        client.send();
    });
}

// 代码延时
const timeout = (delay = 1000) => {
    return new Promise(resolve => {setTimeout(resolve, delay)});
}

timeout(2000).then(() => {
    console.log('123');
    return timeout(2000);
});


async function sleep(delay = 1000) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}
// async 等同于fn 返回 new Promise
 // await相当于then
    // then的规范，then的返回值也是一个promise，后面的代码需要等待当前promise的决议后才能执行
    // 假如then返回的值是同步的，则该promise会立即决议；如果该promise需要等异步执行完才能决议
    // then后面的代码需要等then返回的promise决议后才能执行
    // async相当于then，则如果await后面跟的是异步的promise，则await后面的代码需要暂停执行

// async函数返回的是promise对象，可以作为await命令的参数
function hd() {
    return new Promise((resolve, reject) => {
    });
}
// async函数返回一个promise
async function show() {
    for (const v of ['1', '2']) {
        // await与async配合使用
        await sleep(); // await后面如果是一个promise的话，则promise状态必须改变后才会继续执行
        console.log(v);
    }
}


function interval(delay = 1000, callback) {
    return new Promise(resolve => {
        let id = setInterval(() => {
            callback(id, resolve);
        }, delay);
    });
}

interval(100, (id, resolve) => {
    console.log(1);
    clearInterval(id);
    resolve();
})
// setInterval封装


// setTimeout封装promise

function ajax(url) {
    return new Promise((resolve, reject) => {
        // const handler = () => {
        //     if (this.readyState !== 4) {
        //         return;
        //     }
        //     if (this.status === 200) {
        //         resolve(this.response);
        //     } else {
        //         reject(new Error(this.statusText));
        //     }
        // };
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function() {
            if (this.status === 200) {
                resolve(JSON.parse(this.response));
            } else {
                reject('加载失败');
            }
        }
        xhr.onerror = function() {
            reject(this);
        };
        // xhr.onreadystatechange = handler;
        // xhr.responseType = 'json';
        // xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();
    });
}
class User {
    constructor(name) {
        this.name = name;
    }
    then(resolve, reject) {
        let user = ajax(`url`);
        resolve(user);
    }
}

new User('ywj');

new Promise((_resolve, _reject) => {

}).then(_data => {

}).catch(_error => {

});
Promise.prototype.catch = function(catchFunc) {
    return this.then(null, catchFunc);
}

Promise.resolve(1).then(_data => {

});
Promise.resolve = function(value) {
    return new Promise((resolve, reject) => {
        resolve(value);
    });
}

Promise.reject = function(reason) {
    return new Promise((_resolve, reject) => {
        reject(reason);
    });
}

Promise.all([promise1, promise2]).then(resultArray => {

}).catch(reason => {

});
Promise.all = function(promiseArray) {
    return new Promise((resolve, reject) => {
        // 边界判断，如果promiseArray不是数组，则报错
        if (!Array.isArray(promiseArray)) {
            return reject(new TypeError('The arguments should be an array'));
        }
        // promiseArray为空数组——特殊判断
        if (promiseArray.length === 0) return resolve([]);
        var remaining = args.length; // 计数器

        var resultArray = [];
        function processValue(i, val) {
            try {
                Promise.resolve(val).then(data => {
                    remaining--;
                    resultArray[i] = data;
                    if (remaining === 0) {
                        resolve(resultArray);
                    }
                });
            } catch (ex) {
                reject(ex);
            }
        }

        for (var i = 0; i < promiseArray.length; i++) {
            processValue(i, promiseArray[i]);
        }
    });
}

// Promise.race([p1,p2,p3]);
Promise.race = function(promiseArray) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promiseArray)) {
            return reject(new Error('Promise.race accepts an array'));
        }
        var len = promiseArray.length;
        if (len === 0) return resolve();

        for (var i = 0; i < len; i++) {
            Promise.resolve(args[i]).then(resolve, reject);
        }
    });
}

new Promise((resolve, reject) => {

});
/**
 * promise解决问题：
 * 1、异步并发状况下数据归一
 * 2、异步串行流程，链式操作
 */
/**
 * PromiseA+规范：
 * 1、三种状态，等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。
 * 2、执行器同步执行
 * 3、具备一个then方法，可以讲执行器内部返回值传出去，实现值的穿透
 * 4、可以捕获执行器内部异常错误，如果出错，promise rejected处理
 * 5、执行器注入内部有resolve、reject两个方法
 * 6、状态只能从pending转变为其他状态，状态一经决议不能再变
 * https://www.icode9.com/content-4-365156.html
 * https://promisesaplus.com/
 */
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
// 这个操作是要解决什么问题？
function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        throw new TypeError('A promise cannot be resolved with itself.');
    }
    let called;
    // x如果是object，则{then: function(){}}
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, err => {
                    if (called) return;
                    called = true;
                    reject(err);
                });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}
// Promise/A+规范
// 1、一个promise的状态只能是pending、fulfilled、rejected三种之一，状态改变只能是pending->fulfilled、pending->rejected。状态不可逆
// 2、promise的then方法接受两个可选参数，表示该promise状态改变时的回调。then方法返回一个promise。
new Promise((resolve, reject) => {
    console.log(1);
    resolve(1);
}).then()
console.log(2);
// 一个完整的promise规范包括，promise执行和对这个promise的状态的解决，发布/订阅，then做的事就是订阅
// promise中处理了先发布后订阅（同步执行）以及先订阅后发布（异步执行）的情况
class Promise {
    constructor(executor) {
        this.state = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledArray = [];
        this.onRejectedArray = [];
    
        // resolve/reject的函数的执行不需要异步，如果resolve/reject异步的话，那么then就不需要判断当前promise的状态了
        // 因为既然是异步，那么执行到then的时候状态应该都没有变更才对
        const resolve = value => {
            if (this.status === PENDING) {
                this.value = value;
                this.status = FULFILLED;
                this.onFulfilledArray.forEach(func => {
                    func(value);
                });
            }
        };
    
        const reject = reason => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = REJECTED;
                this.onRejectedArray.forEach(func => {
                    func(reason);
                });
            }
        };
    
        try {
            executor(resolve, reject);
        } catch (ex) {
            reject(ex);
        }
    }
    then(onFulfilled, onRejected) {
        // onFulfilled如果没有传递，则封装一个function，该function只是把值返回，起到传递值的效果
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data; // 实现值的穿透
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }; // 实现错误的穿透
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                // onFulfilled(this.value);
                // 这里是异步还有一个原因，内部用到了promise2，如果是同步的话，此时promise2尚未创建成功
                setTimeout(() => {
                    try {
                        // 有点像AOP
                        let x = onFulfilled(this.value); // then中返回了新的promise，如果x是一个具体的值，则直接resolve了
                        // 这个是为了什么呢？为了支持promise的链式操作，then方法返回一个新的promise2
                        // 需要对promise2做出决议， resolve/reject就是决议then返回的promise的
                        // then的链式调用有点异步迭代的味道，异步迭代就需要用到函数，递归
                        // 由then里面的promise决定是否继续
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
        
            if (this.status === REJECTED) {
                // onRejected(this.reason);
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
        
            if (this.status === PENDING) {
                // this.onFulfilledArray.push(onFulfilled);
                // this.onRejectedArray.push(onRejected);
                this.onFulfilledArray.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                this.onRejectedArray.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });
        return promise2;
    }
}

// 发布订阅模式，resolve，reject用来发布
// then里面的回调是订阅，通过延时订阅的方式
// 观察者模式，观察者与被观察者，then里面的是观察者，收集到被观察者（promise）的数组中
// then充分利用了Promise的executor是同步执行的特点，then里面的逻辑是同步执行的，promise的执行器也是同步执行的
// then函数是同步执行的，但是then的参数（成功/失败回调）里面的逻辑是异步执行的。
// then函数同步执行做什么呢？收集观察者，如果观察者发现状态已经决议了，就异步执行，如果未决议，就将观察者收集到被观察者的数组中
new Promise((resolve, reject) => {

}).then(function(value) {
    // 默认返回一个新的promise，后面then的回调是添加到该then返回的promise中，那么后面的then什么时候执行依赖
    // 当前promise的状态
    // return new Promise((resolve, reject) => {});
}, null).then(null, function(reason) {

});

// 缓存的事，缓存是浏览器做的，服务端的headers是为了告诉浏览器你要不要使用自己的缓存
// http协议是在tcp协议的基础上添加了请求头等一些信息而已
// cache-control: 'max-age: 10s'||'no-cache'||'no-store'
// expires http低版本使用
// 两对选项：Last-Modified/If-Modified-Since Etags/If-None-Match
// Last-Modified/If-Modified-Since 不精确，已秒为单位
// Etags/If-None-Match 全量Etags计算耗费比较大，实际使用的时候可能有多种策略，所以Etags也可能会不准确
// 实际使用中一般会Last-Modified/If-Modified-Since和Etags/If-None-Match会配合使用，同时cache-control强制缓存也会配合使用
// 即实际中，一般会强制缓存和协商缓存配合使用
// 发不发送请求也是浏览器做的，对于直接请求，浏览器一定会发送请求（因为用户直接操作的），对于非直接请求（浏览器操作的），浏览器根据缓存配置做处理 


// 跨域也是，同源策略是浏览器为了安全考虑设置的策略。对于跨域的请求，网络层也发送请求了，但是浏览器使用不使用也需要服务器配合
// 服务器告诉浏览器这个跨域请求服务器是允许的，你浏览器可以使用返回的结果
// 跨域有哪些
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

// diff
function patch(oldVnode, vnode) {
    // 1、如果两个node的标签不一样，则直接替换
    // 2、标签一样但是是两个文本元素（文本标签没有tag）
    // 3、元素相同：属性不同，复用老元素并且更新属性
    // 4、老的属性和新的虚拟节点
    // 5、更新儿子
    // 5.1、老的有儿子，新的有儿子 dom-diff
    // 5.2、老的有儿子，新的没儿子：删除老儿子
    // 5.3、新的有儿子，老的没儿子：增加新儿子
}
// 如果两个node的标签不一样，则直接替换
vnode.el.parentNode.replaceChild()
// 标签一样但是是两个文本元素（文本标签没有tag）
// 元素相同：属性不同，复用老元素并且更新属性
let el = vnode.el = oldVnode.el;
// 老的属性和新的虚拟节点
function updateProperties(vnode, oldProps = {}) {
    let el = vnode.el;
    // 1、老的属性，新的没有：删除属性。循环老的属性，看新的有没有，如果新的不存在则在元素上直接删除。
    el.removeAttribute(key);
    // 2、新的有，老的没有：直接用新的覆盖。
    // 3、特殊处理style属性，这个属性为对象：设置新样式，遍历老样式，新样式中不存在的话，删除旧样式
    el.style[key] = '';
}
// 更新儿子：老的有儿子，新的有儿子 dom-diff
updateChildren();
function updateChildren(el, oldChildren, newChildren) {
    // 双指针方式更新
    let oldStartIndex = 0;
    let oldEndIndex = oldChildren.length - 1;
    let oldStartNode = oldChildren[0];
    let oldEndNode = oldChildren[oldEndIndex];

    let newStartIndex = 0;
    let newEndIndex = newChildren.length - 1;
    let newStartNode = newChildren[0];
    let newEndNode = newChildren[newEndIndex];

    // 什么时候停止：两个指针一旦重合就循环结束
    while (oldEndIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        // 1、前端中比较常见的场景：尾部插入、头部插入、头移动到尾、尾移动到头、正序、反序
        if (isSameVnode(oldStartNode, newStartNode)) {
            // 比较属性
            patch(oldStartNode, newStartNode); // 递归比对
            oldStartNode = oldChildren[++oldStartIndex];
            newStartNode = newChildren[++newStartIndex];
        } else {

        }
    }
    // 如果新的有剩余
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i<=newEndIndex;i++){
            let ele = createElm(newChildren[i]);
            parent.appendChild(el);
        }
    }
}
function isSameVnode(oldVnode, newVnode) {
    // tag一样，key一样
    return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key);
}
// 老的有儿子，新的没儿子：删除老儿子
el.innerHtml = '';
// 新的有儿子，老的没儿子：增加新儿子
el.appendChild(createElm(child));

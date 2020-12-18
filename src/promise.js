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
    return new Promise((resolve, _reject) => {
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
        // promiseArray为空数组
        var args = Array.prototype.slice.call(promiseArray);
        if (args.length === 0) return resolve([]);
        var remaining = args.length;

        var resultArray = [];
        function res(i, val) {
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

        for (var i = 0; i < args.length; i++) {
            res(i, args[i]);
        }
    });
}

Promise.race = function(promiseArray) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promiseArray)) {
            return reject(new Error('Promise.race accepts an array'));
        }
        var args = Array.prototype.slice.call(promiseArray);
        var len = args.length;
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
 * 1、三种状态，
 * 2、执行器同步执行
 * 3、具备一个then方法，可以讲执行器内部返回值传出去，实现值的穿透
 * 4、可以捕获执行器内部异常错误，如果出错，promise rejected处理
 * 5、执行器注入内部有resolve、reject两个方法
 * 6、状态只能从pending转变为其他状态，状态一经决议不能再变
 */
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        throw new TypeError('A promise cannot be resolved with itself.');
    }
}
// PromiseA+规范
class Promise {
    constructor(executor) {
        this.state = PENDING;
        this.value = undefined;
        this.reason = unescape;
        this.onFulfilledArray = [];
        this.onRejectedArray = [];
    
        const resolve = value => {
            setTimeout(() => {
                if (this.status === PENDING) {
                    this.value = value;
                    this.status = FULFILLED;
                    this.onFulfilledArray.forEach(func => {
                        func(value);
                    });
                }
            }, 0);
        };
    
        const reject = reason => {
            setTimeout(() => {
                if (this.status === PENDING) {
                    this.reason = reason;
                    this.status = REJECTED;
                    this.onRejectedArray.forEach(func => {
                        func(reason);
                    });
                }
            }, 0);
        };
    
        try {
            executor(resolve, reject);
        } catch (ex) {
            reject(ex);
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data; // 实现值的穿透
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }; // 实现错误的穿透
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                onFulfilled(this.value);
            }
        
            if (this.status === REJECTED) {
                onRejected(this.reason);
            }
        
            if (this.status === PENDING) {
                this.onFulfilledArray.push(onFulfilled);
                this.onRejectedArray.push(onRejected);
            }
        });
        return promise2;
    }
}

new Promise((resolve, reject) => {

}).then(function(value) {

}, null).then(null, function(reason) {

})

const callbacks = [];
let pending = false;

var timerFunc;

function flushCallbacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}

// p.then里面的回调函数, flushCallbacks异步执行
if (typeof Promise !== 'undefined') {
    const p = Promise.resolve();
    timerFunc = () => {
        p.then(flushCallbacks);
    };
}

export function nextTick(cb) {
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call();
            } catch (e) {

            }
        }
    });
    if (!pending) {
        pending = true;
        timerFunc();
    }
}
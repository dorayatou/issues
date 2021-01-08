// 动态加载样式表
export function loadStyle(href) {
    let style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = href;
    document.getElementsByTagName('head')[0].appendChild(style);
}

// 动态加载js
export function loadScript(url, callback, async) {
    let script = document.createElement('script');
    let scriptLoaded = false;
    script.onload = script.onreadystatechange = function() {
        if (scriptLoaded) {
            return;
        }
        var readyState = script.readyState;
        if ('undefined' === typeof readyState ||
            readyState === 'loaded' ||
            readyState === 'complete') {
                scriptLoaded = true;
                try {
                    if (typeof callback === 'function') {
                        callback();
                    }
                } finally {
                    script.onload = script.onreadystatechange = null;
                    script = null;
                }
            }
    };
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = !!async;
    script.url = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

// 获取url参数
export function getQueryValue(key) {
    let str = window.location.search.substring(1);
    let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    let r = loc.match(reg);
    let result = '';
    if (r !== null) {
        result = decodeURI(r[2]);
    }
    return result;
}

const curry = function(fn) {
    // ES6引入rest参数（...变量名）,用于获取函数的多余参数，这样就不需要使用arguments对象了
    // rest参数搭配的变量是一个数组，该变量将多余的参数放入数组中,args是一个数组，可以直接使用数组的方法
    // rest参数可用于箭头函数中，arguments对象箭头函数中不存在
    // 注意：rest参数之后不能再有其他参数（即只能是最后一个参数）
    // 函数的length属性，不包括rest参数
    return function curriedFn(...args) {
        if (args.length < fn.length) {
            return function() {
                return curriedFn(...args.concat([...arguments]));
            };
        }
        return fn(...args);
    }
}

const fn = (x, y, z, a) => x + y + z + a;
const myfn = curry(fn);
myfn(1)(2)(3)(4);
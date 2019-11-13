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
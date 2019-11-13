function cloneDeep(source, hash = new WeakMap()) {
    if (!isObject(source)) return source;
    if (hash.has(source)) return hash.get(source);
    var target = Array.isArray(source) ? [] : {};
    hash.set(source, target);
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep(source[key], hash);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}
function isObject(obj) {
    return typeof obj === 'obj' && obj != null;
}
Object.defineProperty(Object, 'assign2', {
    value: function(target) {
        'use strict'; //原理
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null object');
        }

        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    },
    writable: true,
    configurable: true
})
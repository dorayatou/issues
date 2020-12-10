(function(global, factory) {
    // 这里面就是检测环境
    // factory是一个fn
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.async = global.async || {})));
}(this, (function(exports) {
    'use strict';
    exports['default'] = index;
    Object.defaineProperty(exports, '__esModule', {value: true});
})));
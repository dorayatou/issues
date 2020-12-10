// Caches the results of an async function.
// proxy 代理异步函数
function slice(arrayLike, start) {
    start = start|0; // 为什么用这种写法？原理是什么呢？
    var newLen = Math.max(arrayLike.length - start, 0); // 不支持反着slice元素,跟原生api不太一样
    var newArr = Array(newLen);
    for(var idx = 0; idx < newLen; idx++)  {
        newArr[idx] = arrayLike[start + idx];
    }
    return newArr;
}
// 接收一个函数，返回一个具备缓存的函数
// 后面再请求该接口，则直接返回缓存的数据
// 本质是闭包，但是用到了函数柯里化
function createCacheApi(fn) {
    let args = arguments.slice(arguments, 1);
    return function() {
        var fnArgs = slice(arguments);
        fn.call();
        var callback = args.pop();
    }
}

const getIpData = async () => {
    const res = await getIpApi();
    if (res.returnCode === 0) {
        data.ip = res;
    }
};

let getIp = createCacheApi(getIpData);
getIp({
    params1: 1
}).then(res => {
    console.log(res);
});

// promise包装一层
// promise与callback互调
function memoize(key, fn) {
    if (!key) {
        // 为了保证key的唯一性，这里需要加一个uuid
        // 库里面的uuid的目的防止hash碰撞
        console.error('must has uniq key');
        return;
    }
    var memo = Object.create(null);
    var queues = Object.create(null);
    var memoized = function memoized() {
        var key = key; // 后面处理成一个唯一的key
        if (has(memo, key)) {
            // 缓存命中
            return memo[key];
        } else if (has(queues, key)) {
            
        } else {

        }
    };

    memoized.memo = memo;
    memoized.unmemoized = fn;
    return memoized;
}
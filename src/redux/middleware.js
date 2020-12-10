// https://blog.csdn.net/jiaoqi6132/article/details/107463270
// https://www.csdn.net/gather_2e/MtjaYg5sNjMzMy1ibG9n.html
// https://www.imooc.com/article/280772

// 场景构建：菜单业务，用户操作菜单的时候能记录日志；或者再每一个请求发送的前后记录日志
// 如果不采用中间件的方式，就需要再fetch前后人工插入日志的代码，这样代码耦合再一起了。如果不想添加日志了，那么需要修改源码
// 如果又想添加其他的增强应用，也需要再fetch前后插入代码，这样fetch的维护变得困难，所以需要一种机制，能够动态植入logger
// 可以组合的、自由插拔的插件机制
export default function applyMiddleware(...middlewares) {
    return (next) => (reducer, initialState) => {
        let store = next(reducer, initialState);
        let dispatch = store.dispatch;
        let chain = [];
        var middlewareAPI = {
            getState: store.getState,
            dispatch: (action) => dispatch(action)
        };
        chain = middlewares.map(middleware => middleware(middlewareAPI));
        dispatch = compose(...chain)(store.dispatch);
        return {
            ...store,
            dispatch
        };
    };
}

const applyMiddleware = (...middlewares) =>
    (next) => (reducer, initialState) => {
        let store = next(reducer, initialState);
        let dispatch = store.dispatch;
        let chain = []
        var middlewareAPI = {
            getState: store.getState,
            dispatch: (action) => dispatch(action)
        };
        chain = middlewares.map(middleware => middleware(middlewareAPI));
        dispatch = compose(...chain)(store.dispatch);
        return {
            ...store,
            dispatch
        }
    }

export default store => next => action => {
    console.log('dispatch:', action);
    next(action);
    console.log('finish:', action);
}

export default function A(store) {
    return function B(next) {
        return function C(action) {
            console.log('dispatch:', action);
            next(action);
            console.log('finish:', action);
        }
    }
}

// 部署管道机制(pipeline)
const pipeline = (...funcs) => 
    val => funcs.reduce((a, b) => b(a), val);

const plus1 = a => a + 1;
const mult2 = a => a * 2;
const addThenMult = pipeline(plus1, mult2);
// 等价于
mult2(plus1(5));

const compose = (...funcs) =>
    arg => funcs.reduceRight((composed, f) => f(composed), arg);
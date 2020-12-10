// const curryFn = function(fn) {
//     console.log('outer', arguments);
//     return function curriedFn(...args) {
//         console.log('inner', arguments);
//         if (args.length < fn.length) {
//             return function() {
//                 console.log('inner1', arguments);
//                 return curriedFn(...args.concat([...arguments]));
//             }
//         }
//         return fn(...args);
//     }
// }

// const fn = (x, y, z, a) => x + y + z + a;
// const myfn = curryFn(fn);
// console.log(myfn(1,2)(2)(3));
// 分析 1、curryFn必须返回一个函数，存储要curry的函数fn
// 2、myfn()需要返回一个函数，是一个闭包，用来存储要收集的参数
// 3、如果参数没有收集够，则继续收集.总之收集够参数就可以了

// 初始化一个函数的参数
// function initialParams(fn) {
//     return function() {
//         var args = slice(arguments);
//         var callback = args.pop();
//         fn.call(this, args, callback);
//     }
// }

// function sum(a,b,c) {
//     return a + b + c;
// }
// initialParams(sum)


function throwError(params) {
    if (params) {
        throw '1';
    }
    return '0';
}
function handleError(params) {
    try {
        throwError(params);
    } catch (error) {
        console.log('error', error);
    }
}

handleError(0);

function App() {
    const [num, updateNum] = useState(0);
    return <p onClick={() => updateNum(num => num + 1)}>
        {num}
    </p>
}

// 首次render时是mount
let isMount = true;
function schedule() {

}
function useState(initialState) {
    let hook;
    // 获取hook对象
    if (isMount) {
        hook = {
            // 保存update的queue
            queue: {
                pending: null
            },
            // 保存hook对应的state
            memoizedState: initialState,
            // 与下一个Hook连接形成单向无环链表
            next: null
        };
        if (!fiber.memoizedState) {
            fiber.memoizedState = hook;
        } else {
            workInProgressHook.next = hook;
        }
        workInProgressHook = hook;
    } else {
        hook = workInProgressHook;
        workInProgressHook = workInProgressHook.next;
    }

    let baseState = hook.memoizedState;
    if (hook.queue.pending) {
        let firstUpdate = hook.queue.pending.next;
        do {
            const action = firstUpdate.action;
            baseState = action(baseState);
            firstUpdate = firstUpdate.next;
        } while (firstUpdate !== hook.queue.pending)
        hook.queue.pending = null;
    }

    hook.memoizedState = baseState;
    return [baseState, dispatchAction.bind(null, hook.queue)];
}
function dispatchAction(queue, action) {
    const update = {
        action,
        next: null
    };
    if (queue.pending === null) {
        update.next = update;
    } else {
        update.next = queue.pending.next;
        queue.pending.next = update;
    }
    queue.pending = update;

    schedule();
}

const fiber = {
    memoizedState: null,
    stateNode: APP
}

ReactDom.render(document.getElementById('#app'), <App />); // mount更新
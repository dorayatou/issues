// 同步并发
class SyncHook {
    constructor() {
        this.tasks = [];
    }
    tap(task) {
        this.tasks.push(task);
    }
    call(...args) {
        this.tasks.forEach(task => task(...args));
    }
}

// let syncHook = new SyncHook();

// 同步带保险并发，如果前一个执行出错，则后面的任务不再执行
class SyncBailHook {
    constructor() {
        this.tasks = [];
    }
    tap(task) {
        this.tasks.push(task);
    }
    call(...args) {
        let ret; // 当前任务执行结果
        // 首先执行一个，do...while
        let index = 0; // 计数器
        do {
            ret = this.tasks[index++](...args);
        } while(ret === undefined && index < this.tasks.length)
    }
}

// waterfall瀑布流模式，上一个任务的结果是下一个任务的输入
// reduce方法：前一个回调的执行的结果会放入下一个回调的参数中
class SyncWaterfallHook {
    constructor() {
        this.tasks = [];
    }
    tap(task) {
        this.tasks.push(task);
    }
    call(...args) {
        let {firstTask, ...others} = this.tasks;
        others.reduce((t, v) => {
            return v(t);
        }, firstTask(...args))
    }
}

// 循环执行
// 借助bail的思想，如果任务返回不是undefined则继续执行
class SyncLoopHook {
    constructor() {
        this.tasks = [];
    }
    tap(task) {
        this.tasks.push(task);
    }
    call(...args) {
        this.tasks.forEach(task => {
            let ret;
            do {
                ret = task(...args);
            } while (ret === undefined)
        });
    }
}

// 异步并发——异步并发一般会有一个回调函数，用来处理当回调都执行完之后的处理
// 异步并发需要计数器，用于统计并发是否执行完毕
// 计数器是框架提供的，但是其值什么时候应该增加是用户决定的（因为是异步，异步执行完才能增加，异步何时执行完框架不知道）
// 所以框架需要给用户暴漏一个接口，用于用户增加计数器
// 如果暴漏，框架负责执行每一个任务，但是任务的状态是用户决定的
// 框架与用户的交互之处就在执行这个地方，当框架触发用户任务执行的时候提供一个额外的接口给到用户，用来用户控制异步任务的状态
// task(...args, cb) 这里的cb就是框架提供的接口
// 框架态和用户态需要有一个交互
class AsyncParallelHook {
    constructor() {
        this.tasks = [];
    }
    tapAsync(task) {
        this.tasks.push(task);
    }
    callAsync(...args) {
        let finalCb = args.pop();
        let index = 0;
        let next = () => {
            index++;
            if (index === this.tasks.length) {
                // 任务执行完毕
                finalCb(...args);
            }
        };
        this.tasks.forEach(task => {
            task(...args, next);
        });
    }
}

// 异步带保险的钩子，带保险的意思是说其中一个任务执行失败了，则不再继续执行了，直接回调
class AsyncParallelBailHook {
    constructor() {
        this.tasks = [];
    }
    tapAsync(task) {
        this.tasks.push(task);
    }
    callAsync(...args) {
        let finalCb = args.pop();
        let index = 0;
        let next = (err) => {
            index++;
            // 如果中间有一个报错了就直接执行结果
            // 或者所有异步任务都执行完了就直接执行结果
            if (err !== undefined || index === this.tasks.length) {
                finalCb(...args);
            }
        };
        this.tasks.forEach(task => {
            task(...args, next);
        });
    }
}

// 异步串行：串行的意思是执行完一个再执行下一个，所以何时执行下一个任务是框架决定的（何时执行任务都是框架执行的）
// 只是框架是并发执行任务还是一个一个串行执行任务
// 如果达到串行执行任务，即异步迭代，需要中间函数，异步都是需要中间函数的
// 因为异步任务的执行是框架做的，而异步任务的结果是用户态决定的，异步任务被分成了两个部分
// 而这两个部分只有组合到一块才算一个完整的任务，这两个部分分属两块，必须有一个中间人连接才能将这两个部分组合成一个整体
// 所以异步任务一定有一个中间函数
// 异步串行，关键是何时执行下一个任务，前一个任务完成执行下一个任务
class AsyncSeriesHook {
    constructor() {
        this.tasks = [];
    }
    tapAsync(task) {
        this.tasks.push(task);
    }
    callAsync(...args) {
        let finalCb = args.pop();
        let index = 0;
        let next = () => {
            if (index === this.tasks.length) {
                // 所有任务执行完了，是否需要做其他的事呢？
                finalCb(...args);
            }
            // 这里很关键，需要把next传递给用户，让用户控制何时执行下一个任务
            // 递归执行
            this.tasks[index++](...args, next);
        };
        next(); // 开始第一个任务执行
    }
}

// 异步串行带保险，其中一个任务执行失败，其他任务不再执行，直接执行最后一个回调
// 带保险的意思是任务执行失败了，任务执行失败不继续执行下一个任务是框架做的事，但是任务执行失败是用户态
// 框架如何知道用户态呢，依然是借助中间人，中间人将任务的状态给到框架，框架默认以undefined为成功
// 如果中间人带来了非undefined的状态，框架认为认为执行失败了
class AsyncSeriesBailHook {
    constructor() {
        this.tasks = [];
    }
    tapAsync(task) {
        this.tasks.push(task);
    }
    callAsync(...args) {
        let finalCb = args.pop();
        let index = 0; // 计数器，控制任务是否执行完毕，以及应该执行哪个任务
        // err 上一个任务的执行状态，由用户通过中间人传递给框架，框架默认是undefined为成功
        let next = (err) => {
            if (err !== undefined || index === this.tasks.length) {
                // 任务中途失败或者所有任务都执行完毕
                finalCb(...args);
            }
            this.tasks[index++](...args, next);
        };
        next();
    }
}

// 异步串行：可循环的异步串行，借助返回结果值，如果中间人带回来的不是undefined则继续执行当前任务
class AsyncSeriesLoopHook {
    constructor() {
        this.tasks = [];
    }
    tapAsync(task) {
        this.tasks.push(task);
    }
    callAsync(...args) {
        let finalCb = args.pop();
        let index = 0;
        let next = (data) => {
            if (index === this.tasks.length) {
                finalCb();
            }
            let task = this.tasks[index++];
            if (data !== undefined) {
                task(...args, next);
            } else {
                index++;
            }
        };
        next();
    }
}

// 异步瀑布流，瀑布流上一个异步结果给到下一个异步任务
// 上一个的异步结果（异步结果包括两种，成功和失败，按照error-first处理）通过中间人带给框架
// 同步可以用reduce收敛结果，异步不行，异步的结果框架不知道
class AsyncSeriesWaterfallHook {
    constructor() {
        this.tasks = [];
    }
    tapAsync(task) {
        this.tasks.push(task);
    }
    callAsync(...args) {
        let finalCb = args.pop();
        let index = 0;
        // 异步结果：err代表失败，data代表成功
        // 既然是异步串行，那么其中一个异步任务执行失败了串行就会失败了，将失败的状态
        // 下一个任务应该处理上一个任务的成功或者失败
        // 但是一般情况下我们关注的是所有任务都成功才行，如果其中任何一个任务失败了就失败了直接执行最后的回调
        // 在最后的回调中处理失败
        // 也就是，异步串行流关注整个流的成功和失败，不关注中间某一个失败
        // 关注任务序列的成功或者失败
        let next = (err, data) => {
            if (err !== undefined || index === this.tasks.length) {
                finalCb(err, data); // 任务序列的回调遵守error-first风格
            }
            // 每一个任务不关注上一个任务的失败状态，失败状态任务序列的回调关注
            this.tasks[index++](...args, next);
        };
        next();
    }
}

// 最后聊聊promise在控制异步流上的方案
// 异步解决方案
// 都说promise是异步解决方案，我们想一下为什么promise是异步解决方案呢？
// 回调是一种解决方案，订阅发布也是一种异步解决方案，而且解耦，订阅发布是把回调搜集起来然后等待执行，本质还是回调，就是回调解耦了
// 回调是一个可以将异步结果
// 说是异步解决方案，异步是什么？异步分段执行，第一阶段和第二阶段分开的，只要能将第一阶段的执行和第二阶段连接起来就能走完整个任务
// 回调是一个中间人，中间人能拿到第二阶段的结果
// promise的第二阶段也可以
const async = require('async');

// 这是worker
// 这个应用场景是什么呢？
// var cargo = async.queue(function(tasks, callback) {
//     console.log('begin', tasks.name);
//     for (var i = 0; i < tasks.length; i++) {
//         console.log('hello ' + tasks[i].name);
//     }
//     callback();
// }, 3);
// cargo.drain = function() {
//     console.log('all items have been processed');
// }

// 队列example
// 这是任务
// console.log('task1');
// cargo.push({name: 'foo'}, function(err) {
//     console.log('finishied processing foo');
// });
// console.log('task2');
// cargo.push({name: 'bar'}, function(err) {
//     console.log('finishied processing bar');
// });
// console.log('task3');
// cargo.push({name: 'baz'}, function(err) {
//     console.log('finishied processing baz');
// });
// console.log('task4');
// cargo.push({name: 'foo1'}, function(err) {
//     console.log('finishied processing foo');
// });
// console.log('task5');
// cargo.push({name: 'bar1'}, function(err) {
//     console.log('finishied processing bar');
// });
// console.log('task6');
// cargo.push({name: 'baz1'}, function(err) {
//     console.log('finishied processing baz');
// });
// 阻塞函数
// const sleep = async (ms = 0) => {
// 	return new Promise((resolve, reject) => {
//         console.log('sleep');
//         return setTimeout(resolve(true), ms);
// 	})
// }

// let total = 0;
// const demoFunc = async () => {
//     let count = total;
//     console.log('before', count);
//     await sleep(2000)
//     total = count + 1;
//     console.log('after', total);
// }

// demoFunc();
// demoFunc();
// sleep(4000);
// console.log('total', total); // 输出 1

// let queue = Promise.resolve(true);

// const queue_exec = async (fn) => {
//     queue = queue.then(() => {
//         try {
//             return Promise.resolve(fn());
//         } catch(err) {
//             return Promise.reject(err);
//         }
//     });
//     return queue;
// }
// queue_exec(demoFunc);
// console.log('total2', total); // 输出 1

// new Promise(function(resolve, reject) {
    // resolve('success'); // 框架提供的
// });
// 创建一个队列，传入队列的worker
// callback可选
// payload worker一下处理payload个数量的任务，吞吐量
// 相当于批量处理任务，worker能一次性处理多少个任务
// 调度分为：
var q = async.queue(function(task, callback){
    // task/callback也是框架提供的
    // 比如这里是打点的需求，这里需要把打点的数据传过来
    console.log('我是处理队列任务的worker，我处理的任务是', task);
    console.log(`${task}任务执行完毕`, task);
    callback(); // 框架需要的,执行下一个任务
}, 3);

q.drain = function() {
    console.log('all items have been processed');
};

q.error = function(err, task) {
    console.error('task experienced an error');
};

// add some items to the queue
q.push({name: 'foo'}, function(err) {
    console.log('finished processing foo');
});
// callback is optional
q.push({name: 'bar'});

// add some items to the queue (batch-wise)
q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
    console.log('finished processing item');
});
q.push([{name: 'baz1'},{name: 'bay2'},{name: 'bax3'}], function(err) {
    console.log('finished processing item');
});
// add some items to the front of the queue
q.unshift({name: 'bar'}, function (err) {
    console.log('finished processing bar');
});

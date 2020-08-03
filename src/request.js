function request(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(response =>{
            // http层面对应的response对象
            if (response.status === 200) {
                // fetch
                // response对象的body对象很有意思，里面有一个locked属性，默认为false
                // 如果执行过response.json()方法，则locked属性的值变为true
                // 再次执行response.json()方法的话，就会报错 TypeError，提示 'body stream is locked'
                // request 和 response body只能被使用一次（由于设计成了stream的方式，所以它们只能被读取一次）
                return response.json();
            }

            // 向外通信
        })
        .then(data => {
            // 业务层面的response
            // 根据returncode 确认业务逻辑
            // if (data.returncode >= 0) {

            // } else {

            // }
        })
        .catch(error => {
            // 
            console.error('error', error);
            reject(data);
        });
    });
}

function request4(url) {
    /**
     * fn 为唯一参数
     * new Promise(fn)
     */
    return new Promise((resolve, reject) => {
        p2 = fetch(url);
		console.error('p2', p2);
        p0 = p2.then(response =>{
			console.error('response', response);
            if (response.ok) {
				console.error('123');
                resolve(response.json());
            }
        }, function() {});
		console.error('p0', p0);
        p0.then(function(data){
			console.error('data', data);
            reject(data);
        }, function(err){
			console.error('error2', err);
		})
        .catch(error => {
            //
            console.error('error', error);
            reject(data);
        });
    });
}

new Promise(function(resolve, reject) {

});


new A()
.task(1, 3000)
.task(2, 2000)
.task(3, 1000)
.run()

// 本质：异步串行的队列
// 任务队列——task往队列里推送任务——run启动队列
// 如何告知第二个任务启动——事件方式utils.trigger('run-next', index);
// next方式
// 事件发布

new Promise()
.then()
.then()
.then()

// Promise构建串行异步
// 任务列表
var T = [];
function onStateChange() {
    return Promise.resolve(Math.random() > 0.5);
}

function taskFactory() {
    for (var i = 0; i < 10; i++) {
        T.push(
            {
                name: i,
                run: function() {
                    var self = this;
                    return new Promise(function(resolve, reject) {
                        onStateChange().then(function(isResolve) {
                            if (isResolve) {
                                console.log('success' + self.name);
                                resolve('success' + self.name);
                            } else {
                                console.log('fail' + self.name);
                                reject('fail' + self.name);
                            }
                        })
                    });
                }
            }
        )
    }
}

taskFactory();

// 队列序号
var index = 0;

function doTask() {
    if (index === T.length - 1) {
        return Promise.resolve('tasks done');
    }
    return new Promise(function(resolve, reject) {
        T[index].run().then(function(result) {
            index++;
            resolve(doTask());
        }).catch(function(failresult) {
            resolve(faileresult);
        });
    });
}

doTask().then(function(result) {
    console.log('result' + result);
});

// 异步串行——非瀑布流

// 并发请求队列
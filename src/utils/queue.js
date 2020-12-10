// 优先级队列
// 一个比较普遍的问题，给定一个字符串，统计字符串中各个字符的出现情况
// ASCLL 用8位表示，表示区间0-255，总共266个字符，常用的字符一般0-128就可以表示
// 字符串
let str = 'I love you';
function proprity(str) {
    // 初始化一个256 size的一维数组，用来统计各个字符出现的次数
    let posiablyArr = new Array(256).fill(0);
    // 迭代字符串，统计出现的次数
    // 字符串本身部署了迭代器,，字符串都有哪些迭代方法
    let getIterator = str[Symbol.iterator]();
    // 字符转换为ASCLL格式
    let iterator = getIterator.next();
    // 字符串未循环完，并且不是空格
    while(!iterator.done) {
        let char = iterator.value;
        if (char != ' ') {
            posiablyArr[char.charCodeAt()]++;
        }
        iterator = getIterator.next();
    }
    function printCharNumber(char, num) {
        console.log(`字符${char}出现的次数为${num}`);
    }
   
    // 按照字符的出现次数排序，从高到低依次输出
    // 这涉及到排序,最简单的排序是冒泡
    // sort排序的原理是结果
    // 小于0，降序
    // 等于0 ，位置不变
    // 大于0，降序
    // 这样是不行的，数组里存放的元素位置变了，但是数组的下标对应的是字符的ASCLL，这个关系被破坏了
    // 比如 [0,1,2] => [2,1,0]
    // posiablyArr.sort(function(prev, next) {
    //     return next - prev;
    // });
    // 这种情况的排序需要借助其他工具了
    // 输出的顺序是字符在ASCLL表中的位置
    // 如果是数组的方式队列的话，就暂时不需要封装Queue了
    var queue = new Array();
    for (var i = 0; i < 255; i++) {
        if (posiablyArr[i] != 0) {
            let position = queue.findIndex(item => item.priority < posiablyArr[i]);
            queue.splice(position, 0, {
                priority: posiablyArr[i],
                char: String.fromCharCode(i)
            });
        }
    }
    while((data = queue.shift())) {
        printCharNumber(data.char, data.priority);
    }
}

proprity(str);

// 优先级队列底层还是队列，构建队列首先考虑，队列采用什么存储结构，逻辑结构，线性队列（数组）、链式队列（单链表/双链表/循环链表）
// 定好队列的类别后就用基础的队列相关的方法
// 队列中存放的节点不一样，处理队列中数据的方式就不一样
// 平时总说，事件队列，指什么呢？队列中存放的是事件/任务，是函数
// javascript引擎是处理事件队列中元素的worker，所以呢，队列构建完后还需要一个worker去处理队列中的元素
// 简单来讲，一种队列的worker是一样的，javascript的事件队列的元素的特点是用JavaScript语言编写的，只能通过JavaScript引擎这个worker处理
// 相反，如果队列中推入了C语言的函数，则JavaScript引擎这个worker是处理不了的。所以理论上来讲，一个worker对应一个队列。
// 但是往复杂来说，可以通过代码的方式来让一个队列支持各个类型的任务，但是这些任务需要有一个类型标志，要由哪个worker处理
// 言归正传，将每一个字符和它的权重（出现次数）当作一个队列中元素的数据域存储，并且按照权重构建一个优先级队列
// 队列选型：数据是有限的，最多是256个元素，数组就可以了，链式队列需要额外一个空间存储指针
function Queue() {
    this.queue = new Array();
    this.addNode = function(data) {
        let position = this.queue.findIndex(item => item.priority < data.priority);
        console.log('position', position);
        this.queue.splice(position, 0, data);
    };
}
Queue.prototype.addNode = function(data) {
    let position = this.queue.findIndex(item => item.priority < data.priority);
    this.queue.splice(position, 0, data);
}
// 如果构建数组队列，是否
// 哈夫曼树的构建是运用队列构建，不是通过递归的方式构建。这是构建树的一种方法
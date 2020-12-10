// tree的定义是按照递归定义的，所以代码也是递归
// 什么是树，树或者是空，或者是包括左子树/右子树
// 通过树根节点可以拎起来一颗树
// 通过约定，按照前序遍历的方式输入数据
// 前序遍历的特点是根-左-右
// 假如输入序列'AB#'
// 构造树返回树的根节点，用来对树进行访问
// 此处构建了一个序列可以自动读取
let str = 'AB#D##CE##F##';
let i = -1, len = str.length;
var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;
// 获取集合coll的迭代器
function getIterator(coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
}
// 给字符串部署一个迭代器
// 迭代器，内部有个指针自动向后移动，迭代器是一种模式
// 迭代器把迭代的操作封装起来了，使用者不需要关注数据是什么，不需要维护变量i等迭代的逻辑
// 这是一种思维的转变，正常的for循环生产者的角度在处理代码，迭代器模式从消费者的角度处理代码逻辑
// 生产者和消费者的解耦
// 生成器和迭代器的表达能力很强
function createStrAutoIterator(str) {
    // 字符串原生支持了迭代器，不需要开发者自己实现，直接用原生的迭代器
    // var iterator = getIterator(str);
    // 此处可以简单的写成，是在知道str部署了原生的迭代器的情况下
    var iterator = str[Symbol.iterator]();
    // 闭包保存了一个变量i，控制迭代中的当前顺序
    var i = -1;
    return function next() {
        var item = iterator.next();
        if (item.done) {
            return null;
        }
        i++;
        return item.value;
    }
}
// 手工弄一个生成器，生成器顾名思义就是为了生成函数
function* generateData(str) {
    for (let i = 0; i < str.length; i++) {
        yield str[i];
    }
}
function createStrIterator(str) {
    var iterator = generateData(str); // 获取生成器的迭代器操作句柄
    return function() {
        var item = iterator.next();
        console.log(item);
        if (item) {
            return item.value;
        }
        return null;
    }
}
// var getNextData = createStrAutoIterator(str); // 获取迭代器方法之一
var getNextData = createStrIterator(str); // 获取迭代器方法之二
function createBTree() {
    // let data = str[++i];
    // 获取下一个数据,关键在这里
    let data = getNextData();
    if (data === '#') {
        // 节点无数据
        var node = null;
    } else {
        var node = new BTNode(data);
        node.lchild = createBTree();
        node.rchild = createBTree();
    }
    return node;
}
// 迭代器自动获取下一个要读取的值，部署一个迭代器

// 树节点
function BTNode(data) {
    this.data = data;
    this.lchild = this.rchild = null;
    return this;
}

function visit(root, level) {
    console.log(`节点${root.data}在第${level}层`);
}
// 前序遍历，输出节点的层树
function preTraverse(root, level) {
    if (root) {
        visit(root, level);
        preTraverse(root.lchild, level + 1);
        preTraverse(root.rchild, level + 1);
    }
}

let root = createBTree();
getNextData();
preTraverse(root, 1);

// 构建哈夫曼树根构建二叉树不一样，哈夫曼树是一颗特殊的二叉树
// 借助队列构建哈夫曼树
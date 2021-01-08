// 不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来。

const { debug } = require("webpack");

// 待到函数被真正需要求值的时候，之前传入的所有参数都会被一次性用于求值
function createCompileCreator(baseCompile) {
    return function createCompiler(baseOptions) {
        function compile(template, options) {
            var compiled = baseCompile(template, options);
            return compiled;
        };
        return {
            compile: compile
        }
    }
}


var createCompiler = createCompileCreator(function(template, options) {
    return {
        ast: [],
        render: function() {}
    };
});

createCompiler(baseOptions);

// 函数的柯里化

class TreeNode {
    constructor(val) {
        this.data = val;
        this.left = null;
        this.right = null;
    }
}
// 二叉树反转：递归
function reverseTree(node) {
    if (!node) {
        return;
    }
    let tmp = node.left;
    node.left = node.right;
    node.right = tmp;
    // 反转左子树
    reverseTree(node.left);
    // 反转右子树
    reverseTree(node.right);
}

// url规范
const url = new URL(url, base);
// str='a[name]=1&a[age]=2'
function parse(str) {
    return str.split('&').reduce((t, v) => {
        let {key, value} = v.split('=');
        if (!value) {
            return t;
        }
        // t[key] = decodeURIComponent(value);
        deep_set(t, key.split(/[\[\]]/).filter(x => x), value);
        return t;
    }, {});
}
function deep_set(o, path, value) {
    // []
    for (let i = 0; i < path.length; i++) {
        if (o[path[i+1]] === undefined) {
        } else {
        }
    }
    o[path[i]] = decodeURIComponent(value);
}

// 决策树——递归
// 一组不重复的整数序列[1,2,3,4,5]，查看是否存在一组数其和等于m，并且输出
function sumN(A, n, m, i = 0, decisions = []) {
    if (m === 0) {
        return decisions;
    }
    // 遍历完了
    if (i === A.length || n === 0) {
        return null;
    }

    return sumN(A, n-1, m-A[i], i+1, decisions.concat(A[i])) ||
        sumN(A, n, m, i+1, decisions);
}

// 轮廓：给定一颗树，找到其轮廓
// DFS深度优先遍历，遍历的过程中记录下每层的值
// d记录树的深度
function leftoutlineTree(node, d = 0, outline = []) {
    if (!node) {
        return;
    }
    if (!outline[d]) {
        outline[d] = node.value;
    }
    leftoutlineTree(node.left, d+1, outline);
    leftoutlineTree(node.right, d+1, outline);
    return outline;
}

// 轮廓的变种，寻找每层中最大的值
function maxOfLine(node, d = 0, outline = []) {
    if (!node) {
        return;
    }
    outline[d] = Math.max(outline[d] || -1, node.value);
    maxOfLine(node.left, d+1, outline);
    maxOfLine(node.right, d+1, outline);
    return outline;
}

// 蠕虫爬格子，动态规划方面的
// 首先写出递推表达书
// 沿着格子走，看有多少种走法。起点到终点的问题，点的位置通过坐标(x,y)确定
// 首先需要确定终点有哪些情况：1、上边界，y=0，x沿着y=0前进；2、左边界，x=0,y沿着x=0前进;3、x>0&y>0，f(x, y) = f(x-1,y) + f(x, y-1)
// 4、x=0&&y=0，此时只有一种走法
// 这种方式效率比较低，很多重复计算，所以可以采用缓存的方式避免重复计算的问题
function f(x, y) {
    if (x>0 && y>0) {
        return f(x-1, y) + f(x, y-1);
    } else if (x>0) {
        return f(x-1, y);
    } else if (y>0) {
        return f(x, y-1);
    } else {
        return 1;
    }
}
// 开辟一个数组dp记录每个点的走法，下一个点的走法根据点位置从dp中查找直接使用不再重复计算
// 但是这种本质还是采用了递归的方式，递归就是函数调用栈的执行，采用动态规划的方式求解
// 递归，如果求(3,5)我首先求(2,5)和(3,4)两个点的方式，...从后往前推，先递后归，来回两趟
// 动态规划，我从前往后一趟完成
function f(x,y,dp=[]) {
    if (!dp[x]) {
        dp[x] =[];
    }
    if (dp[x][y] !== undefined) {
        return dp[x][y];
    }
    if (x>0 && y>0) {
        return f(x-1, y) + f(x, y-1);
    } else if (x>0) {
        return f(x-1, y);
    } else if (y>0) {
        return f(x, y-1);
    } else {
        return 1;
    }
    return dp[x][y];
}

function f(x, y) {
    let dp = [];
    for (let i = 0; i <= x; i++) {
        dp[i] = [];
        for (let j = 0; j <= y; j++) {
            if (i===0&&j===0) {
                dp[i][j] = 1;
            } else if (i===0) {
                dp[i][j] = dp[i][j-1];
            } else if (j===0) {
                dp[i][j] = dp[i-1][j];
            } else {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
    }
    return dp[x][y];
}
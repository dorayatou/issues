// 尾调用(Tail call)，函数的最后一步是调用另一个函数
function f(x) {
    return g(x);
}
// 尾调用优化(Tail call optimization)，只保留内层函数的调用帧
// 函数调用自身，成为递归；如果尾调用自身，就是尾递归
function factorial(n) {
    if ( n === 1) return 1;
    return n * factorial(n - 1);
}
// 上面阶乘函数的复杂度O(n)
// 改成尾递归，复杂度O(1)
function factorial(n, total = 1) {
    if (n === 1) return total;
    return factorial(n - 1, n * total);
}

// Fibonacci数列
// 递推公式：
// 如果n = 1 || n = 2，结果为1
// 如果n > 2，结果为前两项之和，需要两个累加器
// 非尾递归的Fibonacci数列
function Fibonacci(n) {
    if (n <= 1) return 1;
    return Fibonacci(n - 1) * Fibonacci(n - 2);
}
// 尾递归
// 尾递归的本质，是将递归方法中的所有需要的“所有状态”通过方法的参数传入下一次调用中
function Fibonacci(n, ac1 = 1, ac2 = 1) {
    if (n <= 1) return ac2;
    return Fibonacci(n - 1, ac2, ac1 + ac2);
}

// 递归函数的改写
// 把所有用到的内部变量改写成函数的参数
// 递归本质上是一种循环操作。纯粹的函数式编程语言没有循环操作指令，所有的循环都是递归实现，这就是为什么尾递归对这些语言及其重要。
// 尾递归优化原理，递归之所以需要优化，原因是调用栈太多，造成溢出，那么只要减少调用栈，就不会溢出。
// 采用循环换掉递归
function sum(x, y) {
    if (y > 0) {
        return sum(x + 1, y - 1);
    } else {
        return x;
    }
}
// sum(1, 100000); // stack overflow

// 蹦床函数(trampoline)可以将递归执行转为循环执行
function trampoline(f) {
    while (f && f instanceof Function) {
        f = f();
    }
    return f;
}

// 尾递归优化实现：首先需要将递归转换成尾递归
function tco(f) {
    var value;
    var active = false;
    var accumulated = []; // accumulator 累加器 功能就是递归调用时“积累”之前调用的结果，并将其传入下一次递归调用中
    return function accumulator() {
        accumulated.push(arguments);
        if (!active) {
            active = true;
            while(accumulated.length) {
                value = f.apply(this, accumulated.shift());
            }
            active = false;
            return value;
        }
    };
}
// 0 1 1 2 3 5
var fac = tco(function Fibonacci(n, ac1 = 1, ac2 = 1) {
    if (n <= 1) return ac2;
    return Fibonacci(n - 1, ac2, ac1 + ac2);
});
// console.log(fac(10000));
// var sum = tco(function(x, y) {
//     if (y > 0) {
//         return sum(x + 1, y - 1);
//     } else {
//         return x;
//     }
// });
// 这里x是累加器的初始值，100000是控制递归深度
// console.log(sum(1, 100000));
// n控制递归的深度
// acc是每一步的累加器，默认是1
function sumOpti(n, acc) {
    if (n < 0) {
        return acc;
    } else {
        return sum(n - 1, acc + 1);
    }
}
// console.log(sumOpti(100000, 1));
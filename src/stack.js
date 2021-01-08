// 单调栈（monotone-stack）
// 维护一个单调递增或递减的栈
// 单调递增栈：从栈底到栈顶数据是从大到小 [4,3,2,1]
// 单调递减栈：栈底到栈顶数据是从小到大 [1,2,3,4]
// [1,2,3,4,2]
// 递增/递减是从栈顶到栈底的过程，按照出栈的顺序而非入栈的顺序，主要考虑到栈是一端受限的操作，按照出栈的顺序决定栈是递增还是递减
// 如果出栈的顺序是递减，则为递减栈；如果出栈的属性是递增，则为递增栈
// 模拟实现一个递增单调栈
// 现有一批数10,3,7,4,12，从左到右依次入栈，则如果栈为空或入栈元素值小于栈顶元素值，则入栈；否则，如果入栈会破坏栈的单调性
// 则需要把比入栈元素小的元素全部出栈。

// 凡是1次遍历的就需要借助其他数据结构，空间换时间
// 单调栈的维护是 O(n) 级的时间复杂度，因为所有元素只会进入栈一次，并且出栈后再也不会进栈了。
// 单调栈的性质：

// 1.单调栈里的元素具有单调性
// 2.元素加入栈前，会在栈顶端把破坏栈单调性的元素都删除
// 3.使用单调栈可以找到元素向左遍历第一个比他小的元素，也可以找到元素向左遍历第一个比他大的元素。
// 递增（减）栈中可以找到元素左右两侧比自身小（大）的第一个元素
// 这条性质主要体现在栈调整过程中，以递增栈为例，当新元素入栈
// 对于出栈元素来说：找到右侧第一个比自身小的元素
// 对于新元素来说：等待所有破环递增顺序的元素出栈后，找到左侧第一个比自身小的元素
// 单调栈保存着数组以下信息：
// 如果是找某个位置左右两边大于此数且最下标靠近它的数位置，那么扫描到下标i的时候的单调栈保存的是0~i-1区间中数字的的递增序列的下标。
// （找某个位置左右两边小于此数且最下标靠近它的数的位置的情况类似）
// 作用：可以O(1)时间得知某个位置左右两侧比他大（或小）的数的位置
// 什么时候能用单调栈？
// 在你有高效率获取某个位置左右两侧比他大（或小）的数的位置的需求的时候。

// 出栈的元素有一个处理，留在栈中的元素有一个统一的处理

function mockLineStack(arr) {
    let stack = [];
    let top = 0;
    for (let i = 0; i < arr.length; i++) {
        if (stack.length === 0 || stack[top] >= arr[i]) {
            stack.push(arr[i]);
            top++;
        } else {
            while (stack.length > 0 && stack[top - 1] < arr[i]) {
                stack.pop();
                top--;
            }
            stack.push(arr[i]);
        }
    }
}
// [4,3,7,1]
// 复杂度O(n^2)
function findSum(arr) {
    let count = 0;
    // 找到后面第一个比自己大的数，中间的个数
    for (let i = 0; i < arr.length; i++) {
        for (let j = 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                count++;
            } else {
                break;
            }
        }
    }
    return count;
}

function fieldSum(arr) {
    let stack = [];
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (stack.length === 0 || stack[top] > arr[i]) {
            stack.push(arr[i]);
        } else {
            while (stack.length > 0 && stack[stack.length - 1] <= arr[i]) {
                stack.pop();
                count++;
            }
            stack.push(arr[i]);
        }
    }
    return count;
}


// 单调递减栈
function largestRectangleArea(arr) {
    arr[0] = 0;
    arr[arr.length] = 0;
    let stack = [];
    let ret = 0;
    for (let i = 0; i < arr.length; i++) {
        if (stack.length === 0 || stack[top] < arr[i]) {
            stack.push(arr[i]);
        } else {
            while (stack.length > 0 && stack[stack.length - 1] > arr[i]) {
                stack.pop();
                let tmp = (i - (stack.length - 1)) * arr[stack-length - 1];
                if (tmp > ret) {
                    ret = tmp;
                }
            }
            stack.push()
        }
    }
}



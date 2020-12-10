// 1、将两个升序链表合并成一个新的【升序】链表并返回。新链表通过拼接给定的两个链表的所有节点组成
// 非递归思路
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
}
function mergeSortLinklist(l1, l2) {
    let newNode = new ListNode('start'), // 做题套路，头节点
        tmp = newNode; // tmp作为哨兵节点
    if (l1 === null) {
        return l2;
    }
    if (l2 === null) {
        return l1;
    }
    while(l1 && l2) {
        if (l1.data >= l2.data) {
            tmp.next = l2;
            l2 = l2.next;
        } else {
            tmp.next = l1;
            l1 = l1.next;
        }
        tmp = tmp.next;
    }
    tmp.next = l1 === null ? l2 : l1;
    return newNode.next;
}

// 递归解法
function mergeSortLinklistT(l1, l2) {
    if (l1 === null) return l2;
    if (l2 === null) return l1;
    if (l1.data > l2.data) {
        l2.next = mergeSortLinklistT(l1, l2.next);
        return l2;
    } else {
        l1.next = mergeSortLinklistT(l1.next, l2);
        return l1;
    }
}

// 2、返回倒数第K个节点：实现一种算法，找出单向链表中倒数第K个节点。返回该节点的值。
// 思路分析：
// 1、最笨的思路，遍历一遍链表，计算出链表的长度len，倒数第K个节点，即len - K的位置的元素，时间复杂度O(2n)
// 1->2->3->4->5 长度是5，倒是第2个，即5-2，第三个元素（从0开始）
// 2、优化思路：双指针，两个指针相差K步开始走，当第二个指针到结尾的时候，第一个指针即使倒是第K个元素，一次遍历完成
// 时间复杂度O(n)
function kthToLast(head, k) {
    let pre = head,
        last = head,
        pos = k;
    
    // 第一个指针先移动K步
    while (pos > 0) {
        last = last.next;
        pos--;
    }
    // 两个指针同时移动
    while (last !== null) {
        pre = pre.next;
        last = last.next;
    }
    return pre.val;
}

// 利用栈解决：先将链表的节点全部压入栈中，然后再把栈中最上面的K个节点出栈，出栈的节点重新串成一个新的链表
// 时间复杂度O(n) 空间复杂度
function kthToLastTwo(head, k) {
    let stack = []; // 利用数组做栈
    // 压栈
    while (head !== null) {
        stack.push(head);
        head = head.next;
    }

    // 创建链表，链表构建的过程是逆序的
    let node = stack.pop();
    while (k > 0) {
        let tmp = stack.pop();
        tmp.next = node;
        node = temp;
    }
    return node.val;
}

// 递归求解-TODO

// 3、反转链表：反转一个单链表
// 本质构建一个新链表
// 思路：最简单的方法，利用栈先进后出的原理，单链表入栈，逐个出栈构建链表
// 关键是各个分支条件
function reverseList(head) {
    // 只有一个节点
    if (head === null) {
        return head;
    }
    let stack = []; // 利用数组做栈
    // 压栈
    while (head !== null) {
        stack.push(head);
        head = head.next;
    }

    let node = stack.pop();
    while (stack.length > 0) {
        let tmp = stack.pop();
        node.next = tmp;
        node = temp;
    }
    // 这一步很关键，最后一个节点就是反转前的头节点，一定要让它的next等于null，否则会构成环
    node.next = null;
    return node;
}

function ListNode(val) {
    this.val = val;
    this.next = null;
}
// 解题思路2：将原链表的节点一个一个摘掉，每次摘掉的链表都让它成为新链表的头节点，然后更新新链表
function reverseListTwo(head) {
    if (head === null) {
        return null;
    }
    let prev = null,
        curr = head;
    while(curr !== null) {
        // 先保存链表的下一个节点
        let next = curr.next;
        // 每次访问的原链表的表节点都会成为新链表的头节点
        curr.next = prev;
        // 更新新链表
        prev = curr;
        // 重新赋值，继续访问
        curr = next;
    }
    return prev;
}


// https://juejin.cn/post/6850418120755494925#heading-4
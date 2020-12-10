class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}
class DoubleLinkNode {
    constructor(val) {
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}
// 链表
class LinkedList {
    constructor(val) {
        val = val === undefined ? 'head' : val;
        this.head = new ListNode(val);
    }
    findByVal(val) {
        let current = this.head;
        while (current !== null && current.val != val) {
            current = current.next;
        }
        return current ? current : -1;
    }
    insert(newVal, val) {
        let current = this.findByVal(val);
        if (current === -1) return false;
        let newNode = new ListNode(newVal);
        newNode.next = current.next;
        current.next = newNode;
    }
    findNodePreByVal(nodeVal) {
        let current = this.head;
        while (current.next !== null && current.next.val !== nodeVal) {
            current = current.next;
        }
        return current !== null ? current : -1;
    }
    findByIndex(index) {
        let current = this.head, pos = 1;
        while (current.next !== null && pos !== index) {
            current = current.next;
            pos++;
        }
        return (current && pos === index) ? current : -1;
    }
    remove(nodeVal) {
        if (nodeVal === 'head') return false;
        let needRemoveNode = this.findByVal(nodeVal);
        if (needRemoveNode === -1) return false;
        let prevNode = this.findNodePreByVal(nodeVal);
        prevNode.next = needRemoveNode.next;
    }
    disPlay() {
        let res = new Array();
        let current = this.head;
        while (current !== null) {
            res.push(current.val);
            current = current.next;
        }
        return res;
    }
    push(nodeVal) {
        let current = this.head;
        let node = new ListNode(nodeVal);
        while (current.next !== null) {
            current = current.next;
        }
        current.next = node;
    }
    frontPush(nodeVal) {
        let newNode = new ListNode(nodeVal);
        this.insert(newNode, 'head');
    }
}
// 链表是一种基本的数据结构，比队列、栈都要基本,队列、栈都是一种链表的使用
class LinkedListT {
    constructor(cfg) {
        this.length = 0;
        this.head = this.tail = null;
        this.type = cfg.type || true;
        this.query = [];
    }

    add(value) {
        if (this.type) {
            this.query.push(value);
            return;
        }
        let newNode = new DoubleLinkNode(value);
        if (this.length === 0) {
            // 链表为空链表
            this.head = this.tail = newNode;
        } else {
            // 将新节点插入到链表的末尾
            this.tail.next = newNode;
            // 更新新节点的前驱指针
            newNode.prev = this.tail;
            // 更新链表的尾指针
            this.tail = newNode;
        }
        this.length++;
    }
    remove(index) {
        // index有效性判断 通过index删除链表
        if (index > this.length - 1 || index < 0) {
            return null;
        }
        // 删除分为：删除头节点、删除中间节点、删除尾节点
        // 从头节点开始
        let node = this.head;
        let i = 0;
        if (index === 0) {
            // 删除的是第一个节点，更新链表的头指针
            this.head = node.next;
            // 删除节点后判断链表是否为空
            if (this.head === null) {
                this.tail = null;
            } else {
                this.head.prev = null;
            }
        } else if (index === this.length - 1) {
            // 删除的是最后一个节点,更新链表的尾指针
            node = this.tail;
            this.tail = node.prev;
            this.tail.next = null;
        } else {
            // 删除的是中间节点，首先找到要删除的节点
            while (i++ < index) {
                node = node.next;
            }
            // 更新删除节点的前驱和后继
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }
        this.length--;
    }
    get(index) {
        if (this.type) {
            return this.query[index];
        }
        return this.node(index).value;
    }
    node(index) {
        if (index > this.length - 1 || index < 0) {
            return null;
        }
        let node = this.head;
        let i = 0;
        while(i++ < index) {
            node = node.next;
        }
        return node;
    }
    update(index, value) {
        if (this.type) {
            this.query[index] = value;
            return;
        }
        this.node(index).value = value;
    }
    size() {
        return this.query.length || this.length;
    }
}

// 栅格排序
class GridSord {
    constructor(options) {
        this.containerWidth = options.containerWidth;
        this.gridWidth = options.gridWidth; // 每个栅格占据的宽度
        this.init();
    }
    init() {
        let curQuery = new LinkedListT({});
        // 计算列数:Math.ceil向上取整
        let span = Math.ceil(this.containerWidth / this.gridWidth);
        // 初始化每列的高度，分成span个栅格
        for (let i = 0; i < span; i++) {
            curQuery.add(0);
        }
        this.curQuery = curQuery;
    }
    getPosition(width, height) {
        let num = Math.ceil(width / this.gridWidth); // 计算占据了几个栅格
        // cur[0] 找到栅格高度最小的列
        let cur = this.getCurrentPointer(num); // 查找要插入的位置
        for (let i = cur[0], len = num + cur[0], newH = cur[1] + height; i < len; i++) {
            this.curQuery.update(i, newH); // 更新元素占据的每一列栅格的高度
        }
        // 返回元素的位置,横向和纵向两个维度
        return [cur[0] * this.gridWidth, cur[1]];
    }
    getCurrentPointer(num) {
        // 哨兵设置,查找的时候设置哨兵是一种策略
        let min = Infinity;
        let idx = 0;
        let len = this.curQuery.size();
        // 外层循环控制 总栅格数len 大于 当前元素占据的栅格树的情况下
        // 比较的次数是len - num 
        // 找到高度最小的栅格列
        // 查找 瀑布流最小高度差算法
        // 如果是等宽的并且间距是1，也就是每次插入节点占据一个栅格，问题就会转变为寻找链表最小值（链表中存储的是当前列的总高度）
        for (let i = 0; i < len; i++) {
            curValue = this.curQuery.get(i);
            if (curValue < min) {
                min = curValue;
            }
        }
        // 如果是等宽的并且间距大于1，每次插入节点的位置，寻找链表中最小值，并且最小值需要满足链表后继的元素个数大于间距 - 1
        // 等宽间距大于1，每一组的高度值和最小，分成n组，求n组的高度值的和最小。n的确定是通过外层循环控制
        let min = Infinity;
        // 算法的时间复杂度n的平方
        for (let i = 0; i <= len - num; i++) {
            // 哨兵,设置一个最小的
            // num个元素的高度和，内层循环控制元素个数
            for (j = 0; j < num; j++) {
                curValue = this.curQuery.get(i + j);
                totalHeight += curValue;
            }
            if (totalHeight < min) {
                min = totalHeight;
                idx = i;
            }
        }
        // 如果不是等宽的，每次插入节点的位置就变成首先转化为等宽间距大于1的问题处理
        for (let i = 0; i <= (len < num ? 0 : len - num); i++) {
            let max = -Infinity;
            let curValue;
            // 内层循环负责找到每轮中的最大值
            for (let j = 0; j < num; j++) {
                curValue = this.curQuery.get(i + j); // 找到第一个值
                // 比较
                if (curValue >= min) {
                    i += j + 1;
                    if (i > len - num) {
                        max = min;
                        break;
                    }
                    j = -1;
                    max = -Infinity;
                    continue;
                }
                // 找最大值
                if (curValue > max) {
                    max = curValue;
                }
            }
            // if (min > max) {
            //     min = max;
            //     idx = i;
            // }
            if (max < min) {
                min = max;
                idx = i;
            }
        }
        return [idx, min];
    }
}
function SingLinkList() {
    function Node(data) {
        this.data = data;
        this.next = null;
    }
   
    var length = 0;
    var head = new Node(null); // 创建一个头节点
    
    this.append = function(val) {
        let node = new Node(val);
        let p = head;
        while(p.next) {
            p = p.next;
        }
        p.next = node;
        length++;
    }

    this.insertAt = function(i, val) {
        let node = new Node(val);
        let p = head;
        let j = 0; // 链表不是数组，链表是从第一个节点开始的
        if (i < 1 || i > length) {
            // 插入位置不对
            return;
        }
        while(p.next && j < i) {
            p = p.next;
            j++;
        }
        
        node.next = p.next;
        p.next = node;
    }

    this.traverse = function() {
        while(p.next) {
            console.log(p.data);
        }
    }

    this.removeAt = function(i) {
        if (i < 1 || i > length) {
            // 删除位置不存在
            return;
        }
        let j = 0;
        while (p.next && j < i) {
            p = p.next;
            j++;
        }
        p.next = p.next.next;
    }
}


let singLinkList = new SingLinkList(); // 首先创建一个空链表，需要有一个头指针

// 给定一个单链表head1和单链表head2，这里的node1和node2是指链表的头节点或者头指针
function traverse(head) {
    if (head.next === null) {
        return; // 空链表
    }
    let p = head; // p指向head
    while(p.next) { // 
        console.log(p.data);
        p = p.next;
    }
}

// 创建链表的过程最终要返回一个head

// 数组队列比较简单
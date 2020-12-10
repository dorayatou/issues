function BTNode(data) {
    this.data = data;
    this.lChild = this.rChild = null;
}

// 树的定义是按照递归定义的，构建一棵树也按照递归
// 构造一颗二叉排序树
// 二叉排序树的查找/插入/删除
// 树的存储是线性链式结构，链式结构的优点是插入/删除方便，但是查找效率低，用二叉树的方式组织链式结构，提高查找的效率
function CreateBTSortTree() {
    let data = getNextData();
    let root = null;
    // 创建一个二叉排序树，从空树开始
    // 涉及到树，首先要有一个根root
    // 插入一个节点，首先判断该树是不是一个空树，如果是空树，则将根节点指向新的节点
    // 如果不是一颗空树，则需要通过根据root节点开始搜索，找到要插入的位置，插入
    this.insert = function(key) {
        var newNode = new BTNode(key);
        if (root === null) {
            root = newNode;
        } else {
            this.insertNode(root, newNode);
        }
    }
    this.insertNode = function(root, newNode) {
        if (newNode.key > root.key) {
            // 插入节点大于子树的根节点，证明要插入的节点需要插入到右子树
            // 如果右子树是空树，则将节点直接插入右子树
            if (root.rChild === null) {
                root.rChild = newNode;
            } else {
                this.insertNode(root.rChild, newNode);
            }
        } else if (newNode.data < root.data) {
            // 插入节点小于子树的根节点，证明要插入的节点需要插入到左子树
            // 如果左子树是空树，则将节点直接插入左子树
            if (root.lChild === null) {
                root.lChild = newNode;
            } else {
                this.insertNode(root.lChild, data);
            }
        }
    }
    this.getMin = function(root) {
        // 二叉排序树按照中序遍历（左-根-右）的方式访问，输出的是从小到大的序列
        // 所以，最小的元素位于左子树的
        if (root) {
            while(root.lChild) {
                root = root.lChild
            }
            return root.data;
        }
        return null;
    }
    this.getMinNode = function(root) {
        if (root) {
            while(root.lChild) {
                root = root.lChild;
            }
            return root;
        }
        return null;
    }
    this.getMax = function(root) {
        // 最大的元素在右子树
        if (root) {
            while(root.rChild) {
                root = root.rChild
            }
            return root.data;
        }
        return null;
    }
    this.getMaxNode = function(root) {
        if (root) {
            while(root.rChild) {
                root = root.rChild;
            }
            return root;
        }
        return null;
    }
    this.search = function(root, key) {
        if (root) {
            if (root.data === key) {
                return true;
            } else if (key > root.data) {
                return this.search(root.rChild, key);
            } else {
                return this.search(root.lChild, key);
            }
        }
        // 如果是空树，直接返回false
        return false;
    }

    // 删除一个节点，首先需要知道树的根root
    this.remove = function(root, key) {
        if (root) {
            if (key > root.data) {
                // 如果要删除的节点大于根节点，则要删除的节点位于右子树
                root.rChild = this.remove(root.rChild, key);
                return root;
            } else if (key < root.data) {
                // 如果要删除的节点小于根节点，则要删除的节点位于左子树
                root.lChild = this.remove(root.rChild, key);
                return root;
            } else {
                if (root.lChild === null && root.rChild === null) {
                    // 叶子节点，直接删除
                    root = null;
                    return root;
                }

                if (root.rChild === null) {
                    // 如果要删除的节点右子树为空，只有左子树，则需要将节点的双亲指向节点的左子树
                    root = root.lChild;
                    return root; 
                } else if (root.lChild === null) {
                    // 如果要删除的节点左子树为空，只有右子树，则直接将节点的右子树指过来就行
                    // 即根节点要删除，将根节点的右子树作为根节点
                    root = root.rChild;
                    return root;
                }

                // 如果要删除的节点既有左孩子又有右孩子，则需要将该节点的直接前驱或者直接后继拎出来作为根节点
                // 这里以直接前驱作为根节点，这里有一个隐含的点，直接前驱一定没有右子树，直接后继一定没有左子树
                // 所以，将直接前驱的数据元素替换成节点的元素或者将直接后继的数据元素替换成节点的元素
                // 同时，将直接前驱的左子树当作要删除节点的左子树或者将直接后继的右子树当作要删除节点的右子树
                // 首先找到直接前驱，就是根节点左子树中的最大值
                // var auxNode = this.getMaxNode(root.lChild);
                // // 将删除节点的元素替换成直接前驱的值
                // root.data = auxNode.data;
                // root.lChild = this.remove(root.lChild, auxNode.data);
                var auxNode = this.getMinNode(root.rChild); // 找到右子树中的最小值，即直接后继
                root.data = auxNode.data;
                // 删除节点的过程也是在构建树的过程，每删除一颗树的节点返回待删除节点的根节点
                root.rChild = this.remove(root.rChild, auxNode.data); // 相当于删除auxNode节点，并且返回auxNode节点的双亲节点
                return root;
            }
        }
        return null;
    }

    // 按层遍历
    this.travelLevelOrder = function(root, arr = []) {
        if (node === null) {
            return null;
        }
        arr.push(root);
        while(arr.length > 0) {
            var node = arr.shift();
            visit(node); // 访问当前层节点
            if (node.left) {
                arr.push(node.left);
            }
            if (node.right) {
                arr.push(node.right);
            }
        }
    }

    // 翻转树
}

// 根据一个有序数组构建一颗二叉排序树（又叫二叉搜索树）
// 二叉平衡树（二叉平衡树也是一颗二叉排序树）


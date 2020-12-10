// 二叉树相关

// 二叉树的遍历
// 二叉树的遍历分为前序遍历（根左右）、中序遍历（左根右）、后续遍历（左右根）、层序遍历

// 习题一：给一棵二叉树 和 一个值，检查二叉树中的是否存在一条路径，这条路径上所有节点的值加起来等于给的那个初始值
function node(data) {
    this.data = data;
    this.left = null;
    this.right = null;
}
function hasPathSum(root, sum, path = []) {
    if (!root) {
        return false;
    }

    path.push(root.value);

    // 叶子节点
    if (root.left === null && root.right === null) {
        if (sum - root.value === 0) {
            // 找到路径了，打印路径
            return true;
        } else {
            return false;
        }
    } else if (root.left !== null && root.right === null) {
        // 右子树为空
        return hasPathSum(root.left, sum - root.value, path);
    } else if (root.left === null && root.right !== null) {
        // 左子树为空
        return hasPathSum(root.right, sum - root.value, path);
    } else {
        // 中间节点，左右子树均不为空
        return hasPathSum(root.left, sum - root.value, path) || hasPathSum(root.right, sum - root.value, path);
    }
}

// 如果需要打印输出路径，则需要访问每个节点
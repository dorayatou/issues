var {produce} = require('immer');
// Persistent Data Structure
// 核心利用Vue3源码中Proxy代理实现了JS的不可变数据结构检测。过程中共享了未被修改的数据，更新后返回了一个全新的引用。
// 最初状态
let currentState = {
    p: {
        x: [2]
    }
};
// nextState 生成的最终状态 draftState草稿状态
let nextState = produce(currentState, draft => {
    draft.p.x = 1;
});

console.log(nextState);
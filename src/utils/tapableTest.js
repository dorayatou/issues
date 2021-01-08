// webpack的tapable
// 同步钩子：并发、串行、瀑布流、带保险
// 异步钩子：并发、串行、瀑布流、带保险
// webpack内部基于插件机制串接，插件是基于事件流，基础类Tapable
const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
} = require('tapable');
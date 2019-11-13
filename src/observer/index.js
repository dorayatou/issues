import Watcher from './watcher';
import Dep from './dep';

class Observable {
    constructor(data) {
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key]);
        });
    }

    defineReactive(obj, key, val) {
        var dep = new Dep();
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return val;
            },
            set(newVal) {
                if (val === newVal) {
                    return;
                }
                val = newVal;
                dep.notify();
            }
        });
    }
}

export default class VM {
    constructor(options) {
        this.data = options.data;
        this.computed = options.computed;
        this.render = options.render;
        new Observable(this.data);
        Object.keys(this.computed).forEach(key => {
            new Watcher(this, key, this.computed[key], this.render);
        });
    }
}



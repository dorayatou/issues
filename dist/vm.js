var VM = (function () {
    'use strict';

    class Dep {
        constructor() {
            this.subs = [];
        }

        addSub(sub) {
            this.subs.push(sub);
        }

        notify() {
            this.subs.forEach(sub => {
                sub.update();
            });
        }
    }

    Dep.target = null;

    class Watcher {
        constructor(vm, key, exp, cb) {
            this.key = key;
            this.cb = cb;
            this.vm = vm;
            this.exp = exp;
            this.value = this.get();
        }

        get() {
            Dep.target = this;
            var value = this.exp.call(this.vm);
            Dep.target = null;
            return value;
        }

        update() {
            this.run();
        }

        run() {
            var value = this.exp.call(this.vm);
            var oldVal = this.value;
            if (value !== oldVal) {
                this.value = value;
                this.cb.call(this.vm, this.key, value, oldVal);
            }
        }
    }

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

    class VM {
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

    return VM;

}());

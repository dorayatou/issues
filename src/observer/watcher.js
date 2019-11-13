import Dep from './dep';
export default class Watcher {
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
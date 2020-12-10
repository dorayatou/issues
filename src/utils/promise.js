const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';
class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        let resolve = (value) => {
            if (this.status === PENDING) {
                this.value = value;
                this.status = RESOLVED;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        };
        let reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = REJECTED;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };
        try {
            executor(resolve, reject);
        } catch (e) {
            console.log('catch error', e);
            reject(e);
        }
    }
    then(onfulfilled, onrejected) {
        if (this.status === RESOLVED) {
            onfulfilled();
        }
        if (this.status === REJECTED) {
            onrejected(this.reason);
        }
        if (this.status === PENDING) {
            this.onResolvedCallbacks.push(() => {
                onfulfilled(this.value);
            });
            this.onRejectedCallbacks.push(() => {
                onrejected(this.reason);
            })
        }
    }
}

new Promise((resolve, reject) => {

});
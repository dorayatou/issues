const getNumbers = () => {
    return Promise.resolve([1,2,3]);
}

const doMulti = num => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (num) {
                resolve(num * num);
            } else {
                reject(new Error('num not specified'))
            }
        }, 2000);
    });
}

const main = async () => {
    console.log('start');
    const nums = [1,2,3];
    nums.forEach(async (x) => {
        const res = await doMulti(x);
        console.log(res);
    });
    console.log('end');
}

// main();


function proxyObj(originObj) {
    let exposeObj = new Proxy(originObj, {
        has: (target, key) => {
            if (['console', 'Math', 'Date'].indexOf(key) >= 0) {
                return target[key];
            }
            if (!target.hasOwnProperty(key)) {
                throw new Error(`Illegal operation for key ${key}`);
            }
            return target[key];
        }
    });
    return exposeObj;
}
const { prototype } = require("better-scroll");

var target = {};
var proxy = new Proxy(target, {
    get: function(target, propKey) {
        console.log(`propKey:${propKey}`);
        return 35;
    }
});
// let obj = Object.create(proxy);
// obj.time;
proxy.a = 5;
console.log('a', JSON.stringify(target));
console.log('b', JSON.stringify(proxy));
console.log('a', target.a);
console.log(proxy.a);

function createArray(...elements) {
    let handler =  {
        get(target, propKey, receiver) {
            let index = Number(propKey);
            if (index < 0) {
                propKey = String(target.length + index);
            }
            return Reflect.get(target, propKey, receiver);
        }
    };
    let target = [];
    target.push(...elements);
    return new Proxy(target, handler);
}
let arr = createArray('a', 'b', 'c');
arr[-1];

var pipe = function(value) {
    var funcStack = [];
    var oproxy = new Proxy({}, {
        get: function(pipeObject, fnName) {
            if (fnName === 'get') {
                return funcStack.reduce(function(val, fn) {
                    return fn(val);
                }, value);
            }
            funcStack.push(window[fnName]);
            return oproxy;
        }
    });
    return oproxy;
}
var double = n => b * 2;
var pow = n => n * n;
var reverseInt = n => n.toString().split('').reverse().join('') | 0;
pipe(3).double.pow.reverseInt.get;

const dom = new Proxy({}, {
    get(target, property) {
        return function(attrs = {}, ...children) {
            const el = document.createElement(property);
            for (let prop of Object.keys(attrs)) {
                el.setAttribute(prop, attrs[prop]);
            }
            for (let child of children) {
                if (typeof child === 'string') {
                    child = document.createTextNode(child);
                }
                el.appendChild(child);
            }
            return el;
        }
    }
});
const el = dom.div({},
    'Hello, my name is ',
    dom.a({href: '//example.com'}, 'Mark'),
    '. I like:',
    dom.ul({},
      dom.li({}, 'The web'),
      dom.li({}, 'Food'),
      dom.li({}, '…actually that\'s it')
    )
);
  
document.body.appendChild(el);

var validator = {
    set: function(obj, prop, value) {
        if (props === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError('The age is not an integer');
            }
            if (value > 200) {
                throw new RangeError('The age seems invalid');
            }
        }
        obj[prop] = value;
    }
};
let person = new Proxy({}, validator);
person.age = 100;

const handler = {
    get(target, key) {
        invariant(key, 'get');
        return target[key];
    },
    set(target, key, value) {
        invariant(key, 'set');
        target[key] = value;
        return true;
    }
};
function invariant(key, action) {
    if (key[0] === '_') {
        throw new Error(`Invalid attempt to ${action} private "${key}" property`);
    }
}

const target = {};
const proxy = new Proxy(target, handler);
proxy._prop;

var handler = {
    apply() {
        return 'I am the target';
    }
};
var target = function() {
    return 'I am the target';
};
var p = new Proxy(target, handler);
p();

var twice = {
    apply(target, ctx, args) {
        return Reflect.apply(...arguments) * 2;
    }
};

function sum(left, right) {
    return left + right;
}
var proxy = new Proxy(sum, twice);
proxy(1, 2);
proxy.call(null, 5, 6);
proxy.apply(null, [7, 8]);
Reflect.apply(proxy, null, [9, 10]);


var handler = {
    has(target, key) {
        if (key[0] === '_') {
            return false;
        }
        return key in target;
    }
};
var target = {_prop: 'foo', prop: 'foo'};
var proxy = new Proxy(target, handler);
'_prop' in proxy;


const handler = {
    construct(target, args, newTarget) {
        return new target(...args);
    }
};

const handler = {
    deletePropery(target, key) {
        invariant(key, 'delete');
        delete target[key];
        return true;
    }
};

const handler = {
    definePropery(target, key, descriptor) {
        return false;
    }
};

const handler = {
    getOwnPropertyDescriptor(target, key) {
        if (key[0] === '_') {
            return;
        }
        return Object.getOwnPropertyDescriptor(target, key);
    }
};
var target = {_foo: 'bar', baz: 'tar'};
var proxy = new Proxy(target, handler);
Object.getOwnPropertyDescriptor(proxy, 'wat');

var proto = {};
const handler = {
    getPrototypeOf(target) {
        return proto;
    }
};

const handler = {
    ownKeys(target) {
        return ['a'];
    }
};


// 哪些是proxy做不到的？也就是哪些是proxy无法代理的
const _name = new WeakMap();
class Person {
    constructor(name) {
        _name.set(this, name);
    }
    get name() {
        return _name.get(this);
    }
}

// 使用proxy实现观察者模式
const person = observable({
    name: '张三',
    age: 20
});
function print() {
    console.log(`${person.name}, ${peroson.age}`);
}
observe(print);

const queuedObservers = new Set();
const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});
function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    queuedObservers.forEach(observe => observe());
    return result;
}
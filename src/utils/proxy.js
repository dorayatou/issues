// Proxy对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）
// 进行访问控制和增加功能
// Proxy代理对象做什么？控制和修改Object的基本行为
// Object的基本行为是：属性访问、属性赋值、删除属性、方法调用等
// 为什么进行控制和修改Object的基本行为？访问控制和增加功能
// let p = new Proxy(target, handler)
// handler对象是一个容纳一批特定属性的占位符对象，包含有Proxy的各个捕捉器(trap)
let target = {};
const handler = {
    // 属性读取操作的捕捉器
    get: function(obj, prop) {
        console.log(`属性${prop}读取被捕捉,对象${JSON.stringify(obj)}`);
        return prop in obj ? obj[prop] : 37;
    },
    set: function(obj, prop, value) {
        console.log(`属性${prop}赋值被捕捉`);
        if (prop === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError('The age is not an integer');
            }
            if (value > 200) {
                throw new RangeError('The age seems invalid');
            }
        }
        obj[prop] = value;
        return true;
    }
}
// const p = new Proxy(target, handler);
// p.a = 1;
// p.b = undefined;
// p.age = 'young';
// console.log(p.a, p.b);
// console.log('c' in p, p.c);
// console.log('访问目标对象', target.a);

function extend(sup, base) {
    // Object.getOwnPropertyDescriptor方法获取对象自有属性的对象描述符
    var descriptor = Object.getOwnPropertyDescriptor(
        base.prototype, 'constructor'
    );
    base.prototype = Object.create(sup.prototype);
    var handler = {
        // new操作符的捕捉器
        construct: function(target, args) {
            var obj = Object.create(base.prototype);
            this.apply(target, obj, args);
            return obj;
        },
        apply: function(target, that, args) {
            sup.apply(that, args);
            base.apply(that, args);
        }
    };
    var proxy = new Proxy(base, handler);
    descriptor.value = proxy;
    Object.defineProperty(base.prototype, 'constructor', descriptor);
    return proxy;
}
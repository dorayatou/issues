// VNode构造函数
class VNode {
    constructor(tag, data, value, type) {
        this.tag = tag && tag.toLowerCase(); // tag
        this.data = data; // 属性对象
        this.value = value; // 文本节点是有值的，元素节点undefined
        this.type = type; // 节点类型
        this.children = []; // 子节点
    }
    appendChild(vnode) {
        this.children.push(vnode);
    }
}

// HTML DOM -> VNode(带坑)
function getVNode(node) {
    let nodeType = node.nodeType;
    let _vnode = null;
    if (nodeType === 1) {
        // 元素
        let nodeName = node.nodeName;
        let attrs = node.attributes;
        let _attrObj = {};
        for (let i = 0; i < attrs.length; i++) {
            _attrObj[attrs[i].nodeName] = attrs[i].nodeValue;
        }
        _vnode = new VNode(nodeName, _attrObj, undefined, nodeType);

        // 子元素
        let childNodes = node.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            _vnode.appendChild(getVNode(childNodes[i]));
        }
    } else if (nodeType === 3) {
        _vnode = new VNode(undefined, undefined, node.nodeValue, nodeType);
    }
    return _vnode;
}

// VNode -> HTML DOM(带有数据的)
function parseVNode(vnode) {
    let type = vnode.type;
    let _node = null;
    if (type === 3) {
        return document.createTextNode(vnode.value);
    } else if (type === 1) {
        _node = document.createElement(vnode.tag);
        // 属性
        let data = vnode.data;
        Object.keys(data).forEach(key => {
            let attrName = key;
            let attrValue = data[key];
            _node.setAttribute(attrName, attrValue);
        });
        // 子元素
        let children = vnode.children;
        children.forEach(subvnode => {
            _node.appendChild(parseVNode(subvnode));
        });
        return _node;
    }
}

let rkuohao = /\{\{(.+?)\}\}/g;
function getValueByPath(obj, path) {
    let paths = path.split('.');
    let res = obj;
    let prop;
    while(prop = paths.shift()) {
        res = res[prop];
    }
    return res;
}
// [（带坑的）VNode + （数据）data] -> （带有数据的）VNode
// 模拟 AST->VNode
function combine(vnode, data) {
    let _type = vnode.type;
    let _data = vnode.data;
    let _value = vnode.value;
    let _tag = vnode.tag;
    let _children = vnode.children;
    
    let _vnode = null;
    if (_type === 3) {
        _value = _value.replace(rkuohao, function(_, g) {
            return getValueByPath(data, g.trim());
        });
        _vnode = new VNode(_tag, _data, _value, _type);
    } else if (_type === 1) {
        _vnode = new VNode(_tag, _data, _value, _type);
        _children.forEach(_subvnode => _vnode.appendChild(combine(_subvnode, data)));
    }
    return _vnode;
}

class Observable {
    constructor(obj) {
        return this.walk(obj);
    }
    walk(obj) {
        const keys = Object.keys(obj);
        keys.forEach(key => this.defineReactive(obj, key, obj[key]));
        return obj;
    }
    defineReactive(obj, key, val) {
        const dep = new Dep();
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get() {
                console.log(`${key}被访问`);
                dep.depend();
                return val;
            },
            set(newVal) {
                console.log(`${key}被赋值`);
                val = newVal;
                dep.notify();
            }
        });
    }
}

function Dep() {
    this.subs = [];
}
Dep.prototype = {
    depend() {
        if (Dep.target) {
            this.addSub(Dep.target);
        }
    },
    addSub(sub) {
        this.subs.push(sub);
    },
    notify() {
        this.subs.forEach(sub => {
            sub.update();
        });
    }
}
Dep.target = null;

function Watcher(vm, expOrFn) {
    this.vm = vm;
    this.exp = expOrFn;
    this.value = this.get();
}
Watcher.prototype = {
    get: function() {
        Dep.target = this;
        var value = this.exp.call(this.vm);
        Dep.target = null;
        return value;
    },
    update() {
        this.exp.call(this.vm);
    }
};

function Vm(options) {
    this._vm = this;
    this._data = options.data;
    // 数据做响应式化处理
    new Observable(this._data);
    let elm = document.querySelector(options.el);
    this._template = elm;
    this._parent = elm.parentNode;
    this.mount(); // 挂载
}
Vm.prototype.mount = function() {
    this.render = this.createRenderFn();
    let mount = () => {
        console.log('页面渲染函数计算更新');
        this.update(this.render());
    }
    new Watcher(this._vm, mount);
}
Vm.prototype.update = function(vnode) {
    let realDOM = parseVNode(vnode);
    this._parent.replaceChild(realDOM, document.querySelector('#root'));
}
Vm.prototype.createRenderFn = function() {
    let ast = getVNode(this._template);
    return function render() {
        let _tmp = combine(ast, this._data);
        return _tmp;
    }
}

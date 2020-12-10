// 这里探讨各种继承问题
// 继承的原理：复制父类的属性和方法来重写子类的原型对象
// 类的继承 父类-》子类
// javascript通过将构造器函数与原型对象相关联的方式来实现继承。
const log = console.log;
function Ctor() {}
Ctor.prototype = {};
let instanceObj = new Ctor();


// 父类型
function Person(name) {
    this.name = name;
}
// 子类型
function Student() {}
let student = new Student();
log(student.__proto__) === Student.prototype;
log(student.name);
Student.prototype = {
    getClass() {}
};
// 方式一：原型链继承
// 实现的方法：子类的原型对象指向父类的实例
// 继承的过程：子类的实例可以通过__proto__访问到子类的原型对象也就是父类的实例
// 从而访问到父类的私有方法，然后通过__proto__指向父类的prototype就可以获得父类原型上得方法
// 从而做到将父类的私有、共有方法和属性当作子类的共有属性
Student.prototype = new Person();
// 如果子类需要添加自己的方法或者重写父类的方法，需要放到替换原型的语句之后

// 优缺点分析
// 优点：
// 缺点：无法实现多继承；来自原型对象的所有属性被所有实例共享；要想未子类新增属性和方法，必须放到原型赋值之后指向，不能放到构造器

// 借用构造函数继承

function Student(name) {
    Person.call(this, name);
}

// 优缺点分析
// 优点：解决了原型链继承中子类实例共享父类引用属性的问题；
// 可以实现多继承（call多个父类对象）
// 缺点：实例不是父类的实例，只是子类的实例；只能继承父类的实例属性和方法，不能继承原型属性和方法
// 无法实现函数复用，每个子类都有父类实例函数的副本，影响性能

// 方式三 原型链+借用构造函数的组合继承
function Student(name) {
    Person.call(this, name);
}
Student.prototype = new Person();
Student.prototype.constructor = Student;

// 优缺点分析：
// 优点：可以继承实例属性/方法，也可以继承原型属性/方法
// 不存在引用属性共享问题;可传参;函数可复用
// 缺点：调用了两次父类构造函数，生成了两份实例

// 方式四：组合继承优化1
function Student(name) {
    Person.call(this, name);
}
Student.prototype = Person.prototype;

// 方式五：组合继承优化2
function Student(name) {
    Person.call(this, name);
}
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;
// 方式六 ES6的class

// 不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来。
// 待到函数被真正需要求值的时候，之前传入的所有参数都会被一次性用于求值
function createCompileCreator(baseCompile) {
    return function createCompiler(baseOptions) {
        function compile(template, options) {
            var compiled = baseCompile(template, options);
            return compiled;
        };
        return {
            compile: compile
        }
    }
}


var createCompiler = createCompileCreator(function(template, options) {
    return {
        ast: [],
        render: function() {}
    };
});

createCompiler(baseOptions);

// 函数的柯里化


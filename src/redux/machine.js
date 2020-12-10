const StateMachine = require('javascript-state-machine');
// 它有三个特征：1、状态总数（state）是有限的；2、任一时刻，只处在一种状态之中；
// 3、某种条件下，会从一种状态转变（transition）到另一种状态
// 有限状态机在Javascript的意义，很多对象可以写成有限状态机
var menu = {
    // 当前状态
    currentState: 'hide',
    initialize: function() {
        var self = this;
        self.on('hover', self.transition);
    },
    // 状态转换
    transition: function(event) {
        switch(this.currentState) {
            case 'hide':
                this.currentState = 'show';
                doSomething();
                break;
            case 'show':
                this.currentState = 'hide';
                doSomething();
                break;
            default:
                console.log('invalid state');
                break;
        }
    }
}

var fsm = new StateMachine({
    init: 'solid',
    transitions: [
        { name: 'melt',     from: 'solid',  to: 'liquid' },
        { name: 'freeze',   from: 'liquid', to: 'solid'  },
        { name: 'vaporize', from: 'liquid', to: 'gas'    },
        { name: 'condense', from: 'gas',    to: 'liquid' }
    ],
    methods: {
        onMelt:     function() { console.log('I melted')    },
        onFreeze:   function() { console.log('I froze')     },
        onVaporize: function() { console.log('I vaporized') },
        onCondense: function() { console.log('I condensed') }
    }
});

const log = console.log;
log(fsm.melt());

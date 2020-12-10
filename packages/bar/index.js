import styles from './index.css';
// import stylesG from './index.global.css';
// import stylesP from './index.pure.css';
import stylesA from './index.custom-module.css';
// const styles = require('./index.css').toString();
// const image = url('1.jpg');
// console.log('image', image);
console.log('styles', JSON.stringify(styles), stylesA);
export function init() {
    new Vue({
        el: '#app',
        data() {
            return {
                number: 10
            }
        },
        template: `<div class="bg ${stylesA.red}">{{number}}</div>`
    });
}


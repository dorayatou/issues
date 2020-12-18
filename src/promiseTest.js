async function hd() {
    console.log(1);
    // await相当于then
    // then的规范，then的返回值也是一个promise，后面的代码需要等待当前promise的决议后才能执行
    // 假如then返回的值是同步的，则该promise会立即决议；如果该promise需要等异步执行完才能决议
    // then后面的代码需要等then返回的promise决议后才能执行
    // async相当于then，则如果await后面跟的是异步的promise，则await后面的代码需要暂停执行
    await new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, 2000);
    })
    return 2;
}

console.log(hd);
console.log(hd());
hd().then(v => {
    console.log(v);
})

// function hd1() {
//     return new Promise((resolve, reject) => {
//         console.log(1);
//         resolve(1);
//     });
// }
// console.log(hd1);

// console.log(hd1());
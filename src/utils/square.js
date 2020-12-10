// 大数相乘 AB*CD=AC(AD+BC)BD
function bigNumberMultiply(num1, num2) {
    let result = new Array(num1.length + num2.length).fill(0); // 开辟2呗的空间
    for (let i = 0; i < num1.length; i++) {
        for (let j = 0; j < num2.length; j++) {
            result[i + j + 1] += parseInt(num1[i], 10) * parseInt(num2[j], 10);
        }
    }

    for (let k = result.length - 1; k > 0; k--) {
        if (result[k] > 10) {
            result[k-1] += Math.floor(result[k] / 10);
            result[k] = result[k] % 10;
        }
    }
   
    return result.join('');
}

console.log(bigNumberMultiply('98', '21'));
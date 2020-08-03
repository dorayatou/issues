const async = require('async');

const doOne = callback => {
    setTimeout(() => {
        callback(null, 'one');
    }, 1000);
};

const doTwo = (arg, callback) => {
    setTimeout(() => {
        console.log(arg);
        callback(null, 'two');
    }, 1000);
};

let array = [];
array.push(doOne);
array.push(doTwo);

// async.parallel(array, (err, result) => {
//     console.log(result);
// });

// async.series(array, (err, result) => {
//     console.log(result);
// });

async.waterfall(array, (err, result) => {
    console.log(result);
});
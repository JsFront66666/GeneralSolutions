const arr=[...Array(1000).keys()];
const obj={};
arr.map(function(item,index) {
    obj[`key${item}`]=item;
});
function forCall(arr) {
    const length = arr.length;
    let i = 0;
    let sum = 0;
    for (let i = 0; i < length; i++) {
        const elem = arr[i];
        sum += elem;
    }
}
function whileCall(arr) {
    const length = arr.length;
    let i = 0;
    let sum = 0;
    while(i<length){
        let elem = arr[i];
        sum += elem;
        i++;
    }
}
function forInCall(arr) {
    let sum = 0;
    for(let prop in arr){
        if(arr.hasOwnProperty(prop)){
            let elem = arr[prop];
            sum += elem;
        }
    }
}
function keyFor(obj) {
    //console.time('objKeys');
    const keys = Object.keys(obj);
    //console.timeEnd('objKeys');
    const length = keys.length;
    let i = 0;
    let sum = 0;
    //console.time();
    for (let i = 0; i < length; i++) {
        const elem = obj[keys[i]];
        sum += elem;
    }
    //console.timeEnd();
}
console.time('arrayFor');
forCall(arr);
console.timeEnd('arrayFor');

console.time('arrayWhile');
whileCall(arr);
console.timeEnd('arrayWhile');

console.time('objForIn');
forInCall(obj);
console.timeEnd('objForIn');

console.time('objKeyFor');
keyFor(obj);
console.timeEnd('objKeyFor');


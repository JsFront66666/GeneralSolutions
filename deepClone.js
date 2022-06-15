//不同类型
//原型链
//递归的时机
//循环引用
//遍历执行效率
//拷贝函数
const mapKey = new Map();
mapKey.set('key', 'value');
mapKey.set('Map', 'code');

const setKey = new Set();
setKey.add('Set');
setKey.add('Information');

const target = {
    number: 1,
    field2: undefined,
    string: 'efsadfsa',
    objectKey: {
        child: 'child'
    },
    arrayKey: [2, 4, 8],
    empty: null,
    mapKey,
    setKey,
    booleanKey: new Boolean(true),
    numberKey: new Number(2),
    stringKey: new String(2),
    symbolKey: Object(Symbol(1)),
    dateKey: new Date(),
    regexpKey: /\d+/,
    errorKey: new Error(),
    /*functionKey: () => {
        console.log('Function Body');
    },*/
    functionKey: function (a, b) {
        return a + b;
    }
};

target.target = target;

function deepClone(target,map=new WeakMap()) {
    if(!isObject(target)){
        return target;
    }
    //初始化
    const type = getType(target);
    return cloneType(target,type,map);
}

const allType=[
    {
        'type':'boolean',
        'clone':cloneOtherDefault
    },
    {
        'type':'number',
        'clone':cloneOtherDefault
    },
    {
        'type':'string',
        'clone':cloneOtherDefault
    },
    {
        'type':'error',
        'clone':cloneOtherDefault
    },
    {
        'type':'date',
        'clone':cloneOtherDefault
    },
    {
        'type':'regexp',
        'clone':cloneRegex
    },
    {
        'type':'symbol',
        'clone':cloneSymbol
    },
    {
        'type':'function',
        'clone':cloneFunction
    },{
        'type':'map',
        'clone':cloneMap
    },
    {
        'type':'set',
        'clone':cloneSet
    },
    {
        'type':'object',
        'clone':cloneObject
    },
    {
        'type':'array',
        'clone':cloneArray
    }
]
function cloneType(target,type,map) {
    let item;
    forEach(allType,(value)=>{
        if(value.type===type){
            item = value;
        }
    });
    if(item){
        return item.clone(target,map);
    }
    return null;
}
function cloneOtherDefault(target) {
    const constructor = target.constructor;
    return new constructor(target);
}
function cloneRegex(target) {
    const reFlags = /\w*$/;
    const result = new target.constructor(target.source, reFlags.exec(target));
    result.lastIndex = target.lastIndex; //why:regexp 实例含有状态信息，lastIndex是会变化的
    return result;
}
function cloneSymbol(target) {
    return Object(Symbol.prototype.valueOf.call(target));
}
function cloneFunction(func) {
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    if (func.prototype) {
        console.log('普通函数');
        const param = paramReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (body) {
            console.log('匹配到函数体：', body[0]);
            if (param) {
                const paramArr = param[0].split(',');
                console.log('匹配到参数：', paramArr);
                return new Function(...paramArr, body[0]);
            } else {
                return new Function(body[0]);
            }
        } else {
            return null;
        }
    } else {
        return eval(funcString);
    }
}

function cloneMap(target) {
    let obj = getInit(target);
    target.forEach((value,key)=>{
        obj.set(key,deepClone(value));
    });
    return obj; 
}
function cloneSet(target) {
    let obj = getInit(target);
    target.forEach((value)=>{
        obj.add(deepClone(value))
    });
    return obj;
}
function cloneArray(target) {
    let obj = getInit(target);
    forEach(target,(value,index)=>{
        obj[index] = deepClone(target[index]);
    });
    return obj;
}
function cloneObject(target,map) {
    let obj = getInit(target);
    //处理循环引用
    if(map.get(target)){
        return map.get(target);
    }
    map.set(target,obj);
    const keys = Object.keys(target);
    forEach(keys,(value,index)=>{
        if(keys){
            index = value;
        }
        if(target.hasOwnProperty(index)){
            obj[index] = deepClone(target[index],map);
        }
    });
    return obj;
}

function isObject(target) {
    return target!=null&&typeof target === 'object'||typeof target === 'function';
}
function getType(target) {
    return Object.prototype.toString.call(target).slice(8,-1).toLowerCase();
}
function getInit(target) {
    const constructor = target.constructor;
    return new constructor();
}
function forEach(target,callback) {
    for (let index = 0,len=target.length; index < len; index++) {
        callback(target[index],index);
    }
}
console.time();
var clone = deepClone(target);
console.timeEnd();
console.log(clone);

const allTypes = [].concat(allType.map((item)=>item.type));
function printAssert() {
    const keys = clone?Object.keys(clone):null;
    if(keys){
        forEach(keys,(value,key)=>{
            let keyOrin=value.slice(0,-3);
            if(allTypes.includes(keyOrin)){
                console.assert((clone[value]!=null)&&(getType(clone[value])===keyOrin)&&(clone[value]!==target[value]),'Not support %s',keyOrin);
            }
        });
    }
}
printAssert();

//改写自：[如何写出一个惊艳面试官的深拷贝? - 掘金](https://juejin.cn/post/6844903929705136141)

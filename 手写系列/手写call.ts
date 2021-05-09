Function.prototype['myCall'] = function (context, ...params) {
    const self = typeof context === "object" ? context || new Object(context) :new Object(context);
    const key = Symbol();
    self[key] = this;
    const result = self[key](...params);
    delete self[key];
    return result;
};

Function.prototype['myApply']=function(context, params){
    return this.myCall(context,...params);
}

Function.prototype['myBind']=function(context, ...params){
    const self = this;
    return function (...args) {
        return self.myCall(context, ...[...params, ...args]);
    }
}



function foo(...arg) {
    console.log(this.name)
    console.log(arg)
}
const obj = {
    name: '我是obj'
}

foo['myCall'](obj,1,2,3);
foo['myApply'](obj,[1,2,3]);
foo['myBind'](obj,1,2,3)();

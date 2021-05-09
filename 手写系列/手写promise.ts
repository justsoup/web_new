
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
const isFunction = function(val:any):boolean{ return typeof val === 'function'; };
const isPromise = function (val:any):boolean { return val instanceof Promise; };

class myPromise{
    status:string;
    value:any;
    onFulfilled :Array<Function>;
    onRejected :Array<Function>;

    constructor(executor:Function) {
        this.status=PENDING;
        this.value=undefined;
        this.onFulfilled=[];
        this.onRejected=[];

        const resolve = (result)=>{
            if(this.status === PENDING){
                this.status = FULFILLED;
                this.value = result;
                this.onFulfilled.forEach(fn=>fn());
            }
        }
        const reject = (reason)=>{
            if(this.status === PENDING){
                this.status = REJECTED;
                this.value = reason;
                this.onRejected.forEach(fn=>fn());
            }
        }

        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    then(fnFulfilled:Function=undefined,fnRejected:Function=undefined){

        //不是函数则直接返回value
        fnFulfilled = isFunction(fnFulfilled)? fnFulfilled : (value) => this.value;
        fnRejected = isFunction(fnRejected)? fnRejected : (value) => { throw new Error(this.value) };

        //否则返回函数数组
        return new myPromise((resolve,reject)=>{

            if(this.status === PENDING){
                this.onFulfilled.push(()=>{
                    setTimeout(()=>{
                        try{
                            let prev_result = fnFulfilled(this.value);
                            isPromise(prev_result)? prev_result.then(resolve,reject) : resolve(prev_result);
                        }catch(err){
                            reject(err);
                        }
                    },0)
                })
                this.onRejected.push(()=>{
                    setTimeout(()=>{
                        try{
                            let prev_result = fnRejected(this.value);
                            isPromise(prev_result)? prev_result.then(resolve,reject) : resolve(prev_result);
                        }catch(err){
                            reject(err);
                        }
                    },0)
                })
            }
        })
    }

    catch(fnRejected:Function=undefined){
        return this.then(null,fnRejected);
    }

    static all(promiseAry:Array<any>){
        return new myPromise((resolve,reject)=>{
            let resultAry=[],
                index=0;
            if(promiseAry.length===0) return;
            else{
                for(let i=0;i<promiseAry.length;i++){
                    promiseAry[i].then(result=>{
                        index++;
                        resultAry[i]=result;
                        if(index===promiseAry.length){
                            resolve(resultAry);
                        }
                    }).catch(reason=>{
                        reject(reason)
                    })
                }
            }
        })
    }

    static race(promiseAry:Array<any>){
        return new myPromise((resolve,reject)=>{
            if(promiseAry.length===0) return;
            else{
                for(let i=0;i<promiseAry.length;i++){
                    promiseAry[i].then(result=>{
                        resolve(result);
                        return;
                    }).catch(reason=>{
                        reject(reason);
                        return;
                    })
                }
            }
        })
    }
}


// 测试代码
let promise1 = new myPromise((resolve,reject)=>{
    setTimeout(resolve,300,'success1')
})
let promise2 = new myPromise((resolve,reject)=>{
    setTimeout(resolve,300,'success2')
})
myPromise.all([promise1,promise2]).then((result)=>{
    console.log(result);
})
myPromise.race([promise1,promise2]).then((result)=>{
    console.log(result);
})
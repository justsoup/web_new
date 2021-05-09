// 状态信息管理员 -> 进入状态仓库
// 施工队驻场人员与施工队连接成功 -> 通过实时显示屏交流

// Loop
// 上级命令 -> 仓库操作工 -> 状态信息管理员修改完成 -> 通知施工队驻场人员 -> 通知施工队


// 状态仓库
const createStore = function (reducer:Function,initialState:object) {
    // 仓库信息
    let state = initialState || {}
    let listeners  = []


    // 实时显示屏
    const getState = () => state

    // 施工队驻场人员
    const subscribe = (reducer:Function) => {
        listeners.push(reducer)
    }

    // 仓库操作工
    const dispatch = (action:IAction) => {
        reducer(state,action)
        listeners.forEach(listen=>listen())
    }

    return {
        getState,
        subscribe,
        dispatch
    }
}

// 状态信息管理员
// 对比前后信息，以最小的代价完成修改
interface IAction {
    type: string
    count:number
}
const reducer = function (state: any, action: IAction) {
    switch (action.type) {
        case 'add':
            state.count = state.count+ action.count
            break
        case 'sub':
            state.count = state.count- action.count
            break
        default:
            break
    }
}

// 施工队
const renderApp = function (state:Object) {
    // DOM操作 对比上一次state与当前state
    // 如果状态发生改变 则触发DOM操作
}


let obj={
    count:0
}

let store = createStore(reducer,obj)
store.subscribe(() => renderApp(store.getState())) 
store.dispatch({'type':'add','count':1})
console.log(obj)
store.dispatch({'type':'sub','count':4})
console.log(obj)










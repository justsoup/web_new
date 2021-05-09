// 码农发布任务 ->仓库情报员收到任务 ->提交状态变化的任务 ->状态信息管理员
// 状态信息管理员 -> 处理方案送到仓库
// 仓库任务安排员接到处理方案 -> 派仓库包打听核实消息-> 将核实的任务交给仓库安排员
// 仓库任务安排员收到回复 -> 依次分配任务给操作员 ->操作员干活
// 状态仓库
var createStore = function (reducer, initialState) {
    // 状态货物
    var state = initialState || {};
    var listeners = [];
    // 仓库包打听
    var getState = function () { return state; };
    // 仓库会计
    var subscribe = function (reducer) {
        listeners.push(reducer);
    };
    // 仓库操作工
    var dispatch = function (action) {
        reducer(state, action);
        listeners.forEach(function (listen) { return listen(); });
    };
    return {
        getState: getState,
        subscribe: subscribe,
        dispatch: dispatch
    };
};
var reducer = function (state, action) {
    switch (action.type) {
        case 'add':
            state.count = state.count + action.count;
            break;
        case 'sub':
            state.count = state.count - action.count;
            break;
        default:
            break;
    }
};
// 操作员
var renderApp = function (state) {
    // DOM操作 对比上一次state与当前state
    // 如果状态发生改变 则触发DOM操作
};
var obj = {
    count: 0
};
var store = createStore(reducer, obj);
store.subscribe(function () { return renderApp(store.getState()); });
store.dispatch({ 'type': 'add', 'count': 1 });
console.log(obj);
store.dispatch({ 'type': 'sub', 'count': 4 });
console.log(obj);

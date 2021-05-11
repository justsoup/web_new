####页面跳转问题
    MPA模式
        路由概念最先于后端产生，每次url改变都会向服务器发送请求，然后后端返回数据

    SPA模式
        Vue的hash模式和history模式都是SPA
    hash
        原理是hashchange事件，会监听hash值变化
        window.addEventListener('hashchange', refreshDom)
    history
        原理是HTML5新增的window.history.pushState和window.history.replaceState两个API，和popstate事件，用另一种方式实现前端路由，改变url不会发送请求
        但是刷新仍然会向服务器发送请求，所以需要服务器将所有路由都重定向到根页面
        window.addEventListener('popstate', refreshDom)

    为什么Vue最顶层要有一个div#app包裹着
        因为我们用SPA模式监听到地址变化时，最后做出的操作是
        document.getElementById('app').innerHTML=render(Dom)


####route routes router
    route = { path: '/foo', component: Foo }
    routes = [
        { path: '/foo', component: Foo },
        { path: '/bar', component: Bar }
    ]
    router = new VueRouter({ routes })
    

####Vue router
    动态路由传参 { path: '/foo/:id', component: Foo }
        /foo/ab?w=2 跳转后 $route.params.id='ab'
        /foo/cd#s=1 跳转后 $route.params.id='cd'
    使用动态路由时(注意点)
        从/foo/ab => /foo/cd 组件实例被复用 组件生命周期钩子不再调用
    复用组件时又想监测变化
        ①watch: {
            $route(to, from) {
            // 对路由变化作出响应...
        }
        ② beforeRouteUpdate(to, from, next) {}
    捕获所有路由
        {
            path: '*'   // 会匹配所有路径(应该放在最后)
        }
        {
            path: '/user-*'    // 会匹配以 `/user-` 开头的任意路径
        }
        使用通配符会多挂载一个属性$route.params.pathMatch(通配符正则过滤后的结果)
    router.push(location, onComplete?, onAbort?)
        即将自定义跳转时，先将当前地址入栈，这样等会点击后退时，弹出原来的地址
        <router-link :to="...">等同于调用router.push
        一步到位：router.push({ path: `/user/${userId}` })

    router.replace(location, onComplete?, onAbort?)
        替换当前history记录
        <router-link :to="..." replace>等同于调用router.replace
    
    router.go(n)
        对window.history.go(n)的封装

            

####钩子函数
    是不是很熟悉的策略模式！
    React Hooks/Vue导航守卫都是其同类
    routes: [
        {
        path: '/',
        name: 'home',
        component: '<div>Home</div>',
        beforeEnter: (next) => {
            console.log('before enter home')
            next()
        },
        afterEnter: (next) => {
            console.log('enter home')
            next()
        },
        beforeLeave: (next) => {
            console.log('start leave home')
            next()
        }
    }]


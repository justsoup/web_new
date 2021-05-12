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
            path: '*'   // 会匹配所有路径(应该放在最后,router必备)
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
    
    name参数：给path路径起代号
    alias参数：将path路径替换成别的路径

    components(多个命名视图):{
        default:xxx,
        a:xxx,
        b:xxx
    }
    <router-view name="a"/>
    <router-view name="b"/>

    redirect参数：
        redirect: '/b'
        redirect: { name: 'foo' }
        redirect: to => {
            const { hash, params, query } = to
            if (query.to === 'foo') {
                return { path: '/foo', query: null }
            }
            if (hash === '#baz') {
                return { name: 'baz', hash: '' }
            }
            if (params.id) {
                return '/with-params/:id'
            } else {
                return '/bar'
            }
        }

    $route函数模式解耦
        {
            path: '/search',
            component: SearchUser,
            props: route => ({ query: route.query.q })
        }
        URL /search?q=vue 会将 {query: 'vue'} 作为属性传递给 SearchUser 组件。

    meta参数(路由元信息): { requiresAuth: true }
        全局导航守卫遍历(判断用户登陆状态)
        router.beforeEach((to, from, next) => {
            if (to.matched.some(record => record.meta.requiresAuth)) {
                if (!auth.loggedIn()) {
                    next({
                        path: '/login',
                        query: { redirect: to.fullPath }
                    })
                } 
                else { next() }
            } 
            else { next() // 确保一定要调用 next() }
        })
    
    单个路由过渡效果
        const Foo = {
            template: `
                <transition name="slide">
                <div class="foo">...</div>
                </transition>
            `
        }

    自定义规则过渡效果
        beforeRouteUpdate (to, from, next) { //定义规则 }

        <transition :name="transitionName">
            <router-view></router-view>
        </transition>

    自定义初始页面滚动位置
        scrollBehavior (to, from, savedPosition) {
            if (savedPosition) return savedPosition 
            else return { x: 0, y: 0 }
        }
        精确位置滚动可以通过to.hash==='#anchor2'{ position.offset = { y: 100 } }
        平滑滚动 behavior: 'smooth',

    路由懒加载(异步组件与webpack代码分割)：
        const Foo = () => import('./Foo.vue')
    
    导航异常捕获
        使用router-link高阶组件时，异常不会打印错误
        router.push('/admin').catch(()=>{})

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

####导航守卫
    

####服务器配置history错误页面
    Nginx
        location / {
            try_files $uri $uri/ /index.html;
        }


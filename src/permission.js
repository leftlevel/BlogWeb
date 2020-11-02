import router from './router/index'
import store from '@/store'

router.beforeEach((to, from, next) => {
    let title = 'leftlevel'
    if (to.meta.params){
        title = `${to.meta.title}:${to.params[to.meta.params] || ''} - ${title}`
    }else {
        title = `${to.meta.title} - ${title}`
    }
    document.title = title
    if (to.path !== from.path ) {
        store.dispatch('setLoading', true);
    }
    next();

    const loginStatus = store.state.loginStatus
    if (loginStatus) {
        next()
    } else {
        //若如果没有登录则无法访问，跳转回登录页面
        if (to.path === '/writeArticle') {
            next({ path: '/login' })
        }
    }
})
router.afterEach((to, from) => {
    // 最多延迟 关闭 loading
    setTimeout(() => {
        store.dispatch('setLoading', false);
    }, 500)
})
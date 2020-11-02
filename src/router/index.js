import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页'}
    },
    {
        path: '/category/:cate',
        name: 'category',
        component: () => import('../views/Home.vue'),
        meta: { title: '分类', params: 'cate'}
    },
    {
        path: '/search/:words',
        name: 'search',
        component: () => import('../views/Home.vue'),
        meta: { title: '搜索', params: 'words'}
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/About.vue'),
        meta: { title: '关于'}
    },
    {
        path: '/friend',
        name: 'friend',
        component: () => import('../views/Friend.vue'),
        meta: { title: '友链'}
    },
    {
        path: '/article/:id',
        name: 'article',
        component: () => import('../views/Articles.vue'),
        meta: { title: '文章'}
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
        meta: { title: '登录'}
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/Register.vue'),
        meta: { title: '注册'}
    },
    {
        path: '/writeArticle',
        name: 'writeArticle',
        component: () => import('@/views/WriteArticle'),
        meta: {title: '写博客'}
    },
    {
        path: '/version',
        name: 'version',
        component: () => import('@/views/Version'),
        meta: {title: '历史版本'}
    },
    {
        path: '/wordCloud',
        name: 'wordCloud',
        component: () => import('@/views/WordCloud'),
        meta: {title: '词云'}
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    {
        path: '*',
        redirect: '/404'
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    // 滚动行为
    scrollBehavior(to, from, savedPosition) {
        // savedPosition 会在你使用浏览器前进或后退按钮时候生效
        // 这个跟你使用 router.go() 或 router.back() 效果一致
        if (savedPosition) {
            return savedPosition
        }else {
            // 如果不是通过上述行为切换组件，就会让页面回到顶部
            return { x: 0, y: 0 }
        }
    }
})

export default router

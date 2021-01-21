/*
 * @Author: leftlevel
 * @Date: 2020-08-07 14:09:44
 * @LastEditors: leftlevel
 * @LastEditTime: 2020-11-27 21:53:48
 * @Description: 
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/style.less'
import './assets/font/iconfont.css'
//引入wowjs后需要引入
import 'animate.css'


import {parseTime} from './utils'
//引入路由守卫,权限控制
import './permission'
//引入md5加密
import md5 from 'js-md5'

//引入使用组件库
Vue.use(ElementUI)
//全局使用md5
Vue.prototype.$md5 = md5

Vue.config.productionTip = false
Vue.filter('parseTime', (v) => parseTime(v,'{y}-{m}-{d}'))
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

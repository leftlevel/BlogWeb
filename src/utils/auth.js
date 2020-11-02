import router from '../router'
import store from '../store'

const USERLOGIN = 'loginStatus'
//获取登录状态
export function getStatus() {
    return localStorage.getItem(USERLOGIN)
}
//设置登录状态
export function setStatus(status) {
    localStorage.setItem(USERLOGIN, status)
}
//移除登录状态
export function removeStatus() {
    localStorage.removeItem('loginStatus')
}
//从本地缓存获取token
export function getToken() {
    let token = JSON.parse(localStorage.getItem("TOKEN_KEY"))
    return token
}
//存入token
export function setToken(token) {
    localStorage.setItem("TOKEN_KEY", JSON.stringify(token))
}
//移除本地token
export function removeToken() {
    localStorage.removeItem('TOKEN_KEY')
}
//判断登录状态
export function checkLogin() {
    if (store.state.loginStatus) {
        return true
    } else {
        router.push({path: '/login'})
        return false
    }
}

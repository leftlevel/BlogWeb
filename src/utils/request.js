import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        let token = getToken()
        if (token) {
            config.headers = {
                'X-Token' : token,
                'Content-Type': 'application/json'
            }
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data
        // store.commit('SET_LOADING',false);

        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 20000) {
            Message({
                message: res.message || '系统异常',
                type: 'warning',
                duration: 5 * 1000
            })
            return res //Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res //响应回的res = response.data
        }
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)

export default service

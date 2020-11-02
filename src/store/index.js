import Vue from 'vue'
import Vuex from 'vuex'
import {getTimeInterval} from '../utils/index'
import {fetchSocial,fetchSiteInfo} from '@/api'
import {getStatus, getToken, setStatus, setToken} from '@/utils/auth'

Vue.use(Vuex)
// 略:后台获取系统运行时间(时间戳单位毫秒)
const runAt = '1602817200000';
let timer = null;
const state = {
    loading: false,
    runTimeInterval: '',
    socials: '',
    websiteInfo: '',
    token: getToken(),
    loginStatus: getStatus(),
    searchWords: ''
}
const mutations = {
    SET_LOADING: (state, v) => {
        state.loading = v;
    },
    SET_TOKEN: (state, v) => {
        state.token = v
        setToken(v)
    },
    SET_SOCIALS: (state, v) => {
        state.socials = v;
    },
    SET_SITE_INFO: (state, v) =>{
      state.websiteInfo = v;
    },
    GET_RUNTIME_INTERVAL: (state) => {
        if (!timer || !state.runTimeInterval) {
            clearInterval(timer)
            timer = setInterval(() => {
                state.runTimeInterval = getTimeInterval(runAt);
            }, 1000);
        }
    },
    SET_LOGINSTATUS: (state, v) => {
        state.loginStatus = v;
        setStatus(v)
    },
    SET_SEARCHWORDS: (state, v) => {
        state.searchWords = v
    }
}
const actions = {
    setLoginStatus: ({commit}, v) => {
        commit('SET_LOGINSTATUS', v);
    },
    setToken: ({commit}, v) => {
        commit('SET_TOKEN', v)
    },
    setLoading: ({commit}, v) => {
        commit('SET_LOADING', v);
    },
    initComputeTime: ({commit}) => {
        commit('GET_RUNTIME_INTERVAL');
    },
    getSiteInfo: ({commit,state}) =>{
        return new Promise(resolve => {
            if (state.websiteInfo){
                resolve(state.websiteInfo)
            }else {
                fetchSiteInfo().then(res => {
                    let data = res.data || {}
                    commit('SET_SITE_INFO',data);
                    resolve(data);
                }).catch(err => {
                    resolve({});
                })
            }
        })
    },
    getSocials: ({commit,state}) =>{
        return new Promise((resolve => {
            if (state.socials){
                resolve(state.socials)
            } else {
                fetchSocial().then(res =>{
                    let data = res.data || []
                    commit('SET_SOCIALS',data);
                    resolve(data);
                }).catch(err =>{
                    resolve([]);
                })
            }
        }))
    }
}
const getters = {
    loading: state => state.loading,
    runTimeInterval: state => state.runTimeInterval,
    notice: state => state.websiteInfo?state.websiteInfo.notice:'',
    loginStatus: state => state.loginStatus,
    token: state => state.token
}
export default new Vuex.Store({
    state,
    mutations,
    actions,
    modules: {},
    getters
})

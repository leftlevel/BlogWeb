import request from '@/utils/request'

// 提交留言
export function add(pojo) {
    return request({
        url: '/message',
        method: 'post',
        data: pojo
    })
}
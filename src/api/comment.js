import request from '@/utils/request'

export function insertComment(data) {
    return request({
        url: '/comment',
        method: 'post',
        data
    })
}

export function getComments(id) {
    return request({
        url: `/comment/${id}`,
        method: 'get'
    })
}
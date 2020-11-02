import request from '@/utils/request'

export function publish(article) {
    return request({
        url: '/publish',
        method: 'post',
        data: article
    })
}

export function getArticleById(id) {
    return request({
        url: `/article/${id}`,
        method: 'get'
    })
}

export function getTags() {
    return request({
        url: '/tag/list',
        method: 'get'
    })
}

export function getTypes() {
    return request({
        url: '/type/list',
        method: 'get'
    })
}

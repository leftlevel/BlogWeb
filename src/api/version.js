import request from '@/utils/request'

export function getVersionList() {
    return request({
        url: '/version',
        method: 'get'
    })
}
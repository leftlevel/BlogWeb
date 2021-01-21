import request from '@/utils/request'

// 七牛云图片上传
export function imgAdd(data) {
    return request({
        url: '/imgUpload',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    })
}
const Mock = require('mockjs');

export default [
    {
        url: '/message',
        type: 'post',
        response: () => {
            return {
                code: 20000,
                flag: true,
                message: '留言成功，感谢您的留言'
            }
        }
    }
]
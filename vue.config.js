module.exports = {
    devServer: {
        port: 9091,
        open: true,
        host: "localhost", //Network设置
        https: false,
        proxy: {    //开发环境代理配置
            //原来是'/dev-api' 替换为[process.env.VUE_APP_BASE_API]
            [process.env.VUE_APP_BASE_API]: {
                //目标服务器地址，代理访问http://localhost:8888
                target: process.env.VUE_APP_SERVICE_URL,
                changeOrigin: true,
                pathRewrite: {
                    // /dev-api/db.json 最终会发送 http://localhost:8001/db.json
                    //将请求地址前缀/dev-api替换为空
                    ['^' + process.env.VUE_APP_BASE_API]: '',
                }
            }
        }
    },
    lintOnSave: false,
    productionSourceMap: false, //打包不生成.map文件，加快打包速度
}

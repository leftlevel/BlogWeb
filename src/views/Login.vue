<template>
    <div class="login-container">
        <el-form
            ref="form"
            :rules="rules"
            :model="form"
            :status-icon="true"
            label-width="70px"
            class="login-form"
        >
            <h2 class="login-title">欢迎回来</h2>
            <el-form-item label="账号" prop="username">
                <el-input type="text" v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="verifyCode" class="verifyCodeItemCss">
                <el-input type="text" v-model="form.verifyCode" style="width: 60%" @keyup.enter.native="submitForm('form')"></el-input>
                <div id="v_container"></div>
            </el-form-item>
            <el-form-item>
                <el-button class="login-button" type="primary" :loading="loadingStatus" @click="submitForm('form')">{{ loadingbtnText }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { login } from '@/api/login'
import { Base64 } from 'js-base64'
import { setToken } from '@/utils/auth'
import { GVerify } from '@/js/verifyCode'
export default {
    mounted() {
        this.verifyCode = new GVerify('v_container')
    },
    data() {
        return {
            loadingStatus: false,
            loadingbtnText: '登录',
            verifyCode: {},
            form: {
                username: 'admin',
                password: 'admin',
                verifyCode: ''
            },
            rules: {
                username: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                verifyCode: [
                    { required: true, message: '验证码不能为空', trigger: ['blur', 'change'] }
                ]
            }
        }
    },

    components: {},

    methods: {
        submitForm(formName) {
            let verifyFlag = this.verifyCode.validate(this.form.verifyCode)
            if (!verifyFlag) {
                this.$notify({
                    title: '系统提示',
                    message: '验证码输入错误',
                    type: 'error'
                })
                return
            }
            this.loadingOpen()
            this.$refs[formName].validate(valid => {
                if (valid) {
                    //let Base64 = require('js-base64').Base64
                    const base64Password = Base64.encode(this.form.password)
                    const md5Password = this.$md5(base64Password)
                    login(this.form.username, md5Password).then(res => {
                        //console.log(res.flag)
                        if (res.flag) {
                            this.$store.dispatch('setToken', res.token)
                            // const userString = decodeURIComponent(escape(window.atob(res.token.split('.')[1])))
                            // console.log(JSON.parse(userString))
                            this.$store.dispatch('setLoginStatus', true)
                            this.$message({
                                message: res.message,
                                type: 'success'
                            })
                            this.loadingClose()
                            this.$router.push('/')
                        } else {
                            this.loadingClose()
                        }
                    })
                } else {
                    this.loadingClose()
                    return false
                }
            })
        },
        loadingOpen() {
            this.loadingStatus = true
            this.loadingbtnText = '登录中...'
        },
        loadingClose() {
            this.loadingStatus = false
            this.loadingbtnText = '登录'
        }
    },
}
</script>

<style scoped>
.login-form {
    width: 400px;
    margin: 160px auto;
    background-color: rgb(255, 255, 255, 0.6);
    padding: 28px;
    border-radius: 20px;
}
.login-container {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('../assets/login.jpg');
}
.login-title {
    font-size: 20px;
    color: #505458;
    text-align: center;
    margin-bottom: 20px;
}
.login-button {
    width: 285px;
}
/* .verifyCodeItemCss {
    border: solid 1px red;
} */
#v_container {
    width: auto;
    height: auto;
    display: inline-flex;
    position: relative;
    top: 1rem;
    margin-top: -1rem;
    margin-left: 5px;
}
</style>
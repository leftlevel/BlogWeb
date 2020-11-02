<template>
    <div class="page-login" @keyup.enter="login">
        <div class="page-login--layer page-login--layer-area">
            <ul class="circles">
                <li v-for="n in 10" :key="n"></li>
            </ul>
        </div>
        <el-form
            :model="registerForm"
            status-icon
            class="login-form"
            ref="registerForm"
            :rules="rules"
        >
            <h2 class="title">欢迎注册</h2>
            <el-form-item prop="username">
                <el-input v-model="registerForm.username" placeholder="账号">
                    <template slot="prepend"
                        ><i class="iconfont iconyonghu"></i
                    ></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    type="password"
                    v-model="registerForm.password"
                    placeholder="密码"
                >
                    <template slot="prepend"
                        ><i class="iconfont iconicon_password"></i
                    ></template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width: 100%" @click="handleRegister('registerForm')">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import '@/assets/css/iconfont/iconfont.css'
import { Base64 } from 'js-base64'
import { register } from '@/api/register'

export default {
    data() {
        return {
            registerForm: {
                username: '',
                password: '',
            },
            rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
            },
        }
    },

    components: {},

    methods: {
        handleRegister(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const base64Password = Base64.encode(this.registerForm.password)
                    const md5Password = this.$md5(base64Password)
                    register({username: this.registerForm.username, password: md5Password}).then(res => {
                        if (res.flag) {
                            this.$message.success(res.message)
                            this.$router.push({path: '/login'})
                        }
                    })
                } else {
                    return false
                }
            })
        }
    },
}
</script>

<style lang="less" scope>
.social-signup-container {
    display: flex;
    flex-direction: row;
    justify-content: center;

    .sign-btn {
        margin: 0 20px;
        .icon-svg2 {
            width: 40px;
            height: 40px;
            vertical-align: -0.15em;
            fill: currentColor;
            overflow: hidden;
            &:hover {
                cursor: pointer;
            }
        }
    }
}

.title {
    text-align: center;
    font-size: 22px;
    color: black;
    font-weight: bold;
    margin: 15px 0;
}

.login-form {
    width: 25%;
}
.page-login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // ---
    background-color: #f0f2f5;
    height: 100%;
    width: 100%;
    position: fixed;
    // 层
    .page-login--layer {
        overflow: auto;
    }
    .page-login--layer-area {
        overflow: hidden;
    }

    // 背景
    .circles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        margin: 0px;
        padding: 0px;
        li {
            position: absolute;
            display: block;
            list-style: none;
            width: 20px;
            height: 20px;
            background: #fff;
            animation: animate 25s linear infinite;
            bottom: -200px;
            @keyframes animate {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                    border-radius: 0;
                }
                100% {
                    transform: translateY(-1000px) rotate(720deg);
                    opacity: 0;
                    border-radius: 50%;
                }
            }
            &:nth-child(1) {
                left: 15%;
                width: 80px;
                height: 80px;
                animation-delay: 0s;
            }
            &:nth-child(2) {
                left: 5%;
                width: 20px;
                height: 20px;
                animation-delay: 2s;
                animation-duration: 12s;
            }
            &:nth-child(3) {
                left: 70%;
                width: 20px;
                height: 20px;
                animation-delay: 4s;
            }
            &:nth-child(4) {
                left: 40%;
                width: 60px;
                height: 60px;
                animation-delay: 0s;
                animation-duration: 18s;
            }
            &:nth-child(5) {
                left: 65%;
                width: 20px;
                height: 20px;
                animation-delay: 0s;
            }
            &:nth-child(6) {
                left: 75%;
                width: 150px;
                height: 150px;
                animation-delay: 3s;
            }
            &:nth-child(7) {
                left: 35%;
                width: 200px;
                height: 200px;
                animation-delay: 7s;
            }
            &:nth-child(8) {
                left: 50%;
                width: 25px;
                height: 25px;
                animation-delay: 15s;
                animation-duration: 45s;
            }
            &:nth-child(9) {
                left: 20%;
                width: 15px;
                height: 15px;
                animation-delay: 2s;
                animation-duration: 35s;
            }
            &:nth-child(10) {
                left: 85%;
                width: 150px;
                height: 150px;
                animation-delay: 0s;
                animation-duration: 11s;
            }
        }
    }
}
</style>
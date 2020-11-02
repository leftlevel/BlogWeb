<template>
    <div class="about">
        <div class="site-content">
            <div class="content-warp">
                <div class="about-site about-info">
                    <section-title><span>❤</span>关于博客</section-title>
                    <div class="info-card">
                        <p>
                            本博客采用的是<a
                                target="_blank"
                                class="out-link"
                                href="https://zhebk.cn/Web/Akina.html"
                                >Akina For Typecho</a
                            >博客的主题
                        </p>
                        <p>
                            然后就开始用
                            <a
                                target="_blank"
                                class="out-link"
                                href="https://cn.vuejs.org/"
                                >Vue</a
                            >
                            搭建这种风格的博客，其中使用的技术有 <el-tag>vue-cli</el-tag>、
                            <el-tag type="success">vue-router</el-tag>、 <el-tag el-tag type="danger">vuex</el-tag>和 UI组件库
                            <a
                                target="_blank"
                                class="out-link"
                                href="https://element.eleme.cn/#/zh-CN"
                                >Element-ui</a
                            >
                        </p>
                        <!-- <p>
                            <a
                                target="_blank"
                                href="https://gitee.com/fengziy/Gblog"
                                style="color: #ff6d6d;"
                                >Gitee仓库</a
                            >
                            |
                            <a
                                target="_blank"
                                href="https://github.com/fengziye/Gblog"
                                style="color: #ff6d6d;"
                                >Github仓库</a
                            >记得star★哟
                        </p> -->
                    </div>
                </div>
                <div class="about-me about-info">
                    <section-title id="Guestbook"
                        ><span>❤</span>给我留言</section-title
                    >
                    <div class="info-card">
                        <!-- <div class="contactForm">
                            <div class="form-item">
                                <label for="mail">邮箱</label>
                                <input class="v" type="email" name="mail" id="mail">
                            </div>
                            <div class="form-item">
                                <label for="content">内容</label>
                                <textarea class="v" id="content" name="content"></textarea>
                            </div>
                            <div class="form-item">
                                <label></label>
                                <button>提交</button>
                            </div>
                        </div> -->
                        <el-form
                            :rules="rules"
                            ref="pojoForm"
                            :model="pojo"
                            label-width="80px"
                            label-position="right"
                        >
                            <el-form-item label="邮箱" prop="email">
                                <el-input
                                    v-model="pojo.email"
                                    autocomplete="off"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="内容" prop="content">
                                <el-input
                                    v-model="pojo.content"
                                    autocomplete="off"
                                    type="textarea"
                                ></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                    type="primary"
                                    icon="el-icon-upload"
                                    @click="addMessage('pojoForm')"
                                    >提交留言</el-button
                                >
                                <el-button
                                    type="primary"
                                    icon="el-icon-refresh"
                                    @click="resetForm('pojoForm')"
                                    >重置留言</el-button
                                >
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import sectionTitle from '@/components/section-title'
import { getTime, getTimeInterval } from '@/utils'
import { add } from '@/api/about'
// import Quote from "@/components/quote";
// import {fetchFriend} from '../api'
export default {
    name: 'About',
    data() {
        return {
            list: [],
            pojo: {
                email: '',
                content: '',
            },
            rules: {
                email: [
                    {
                        required: true,
                        message: '邮箱不能为空',
                        trigger: 'blur',
                    },
                    {
                        type: 'email',
                        message: '请输入正确的邮箱地址',
                        trigger: ['blur', 'change']
                    }
                ],
                content: [
                    {
                        required: true,
                        message: '留言内容不能为空',
                        trigger: ['blur', 'change'],
                    },
                ],
            },
        }
    },
    components: {
        // Quote,
        sectionTitle,
    },
    methods: {
        //重置留言框
        resetForm(formName) {
            //console.log(formName)
            this.$refs[formName].resetFields()
        },

        //提交留言
        addMessage(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //提交表单
                    add(this.pojo).then((response) => {
                        const resp = response
                        //console.log(resp)
                        if (resp.flag) {
                            this.resetForm(formName)
                            this.$message({
                                message: resp.message,
                                type: 'success',
                            })
                        } else {
                            this.$message({
                                message: resp.message,
                                type: 'warning',
                            })
                        }
                    })
                } else {
                    return false
                }
            })
        },
    },
    mounted() {},
}
</script>
<style scoped lang="less">
.about {
    padding-top: 40px;
}

.content-warp {
    margin-top: 80px;

    .about-info {
        margin: 30px 0;

        span {
            color: red;
            margin-right: 10px;
        }

        .info-card {
            min-height: 100px;
            padding: 20px;
            border-radius: 3px;
            margin: 30px 0 50px 0;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            p {
                line-height: 1.7rem;
            }
        }
    }
    .contactForm {
        width: 100%;
        padding: 20px;
        .form-item {
            align-items: center;
            display: flex;
            &:not(:last-child) {
                margin-bottom: 20px;
            }
            label {
                width: 80px;
            }
            .v {
                min-height: 40px;
                line-height: 20px;
                border-radius: 3px;
                padding: 2px 10px;
                outline: none;
                border: 1px solid #8fd0cc;
                width: 100%;
                resize: vertical;
            }
            button {
                width: 100px;
                height: 40px;
                border-radius: 3px;
                outline: 0;
                border-style: none;
                cursor: pointer;
                background-color: #409eff;
                color: white;
                &:hover {
                    opacity: 0.8;
                }
            }
        }
    }
}

/*******/
@media (max-width: 800px) {
    .content-warp {
        margin-top: 0;
    }
}
</style>

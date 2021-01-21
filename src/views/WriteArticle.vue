<template>
  <div class="container">
    <el-row class="write-area">
        <el-col :span="22" :offset="1">
            <el-form ref="article" class="article-from shadow5" :model="article" status-icon hide-required-asterisk label-width="auto" :rules="rules">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="标题" prop="title">
                            <el-input size="medium" v-model="article.title" placeholder="标题"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="分类" prop="type">
                            <el-select size="medium" v-model="article.type" placeholder="请选择文章类型">
                                <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.name" :disabled="item.status === 1 ? true : false"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" :offset="2">
                        <el-form-item label="标签" prop="tag">
                            <el-select size="medium" v-model="article.tag"  placeholder="请选择文章标签">
                                <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.name" :disabled="item.status === 1 ? true : false"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="概述" prop="summary">
                    <el-input type="textarea" :rows="4" placeholder="请输入文章概述" v-model="article.summary">
                    </el-input>
                </el-form-item>
                <mavon-editor ref="editor" :ishljs="true" :box-shadow="false" v-model="article.content" @imgAdd="handleEditorImgAdd"></mavon-editor>
                <el-button class="publish" size="medium" type="primary" @click="publish('article')">发布</el-button>
            </el-form>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { publish, getTags, getTypes } from '@/api/article'
import { imgAdd } from '@/api/upload'
export default {
  data () {
    return {
        article: {
            title: '',
            type: '',
            tag: '',
            summary: '',
            content: ''
        },
        rules: {
            title: [
                { required: true, message: '请输入文章标题', trigger: ['change', 'blur']}
            ],
            type: [
                { required: true, message: '请输选择文章类型', trigger: 'change'}
            ],
            tag: [
                { required: true, message: '请输选择文章标签', trigger: 'change'}
            ],
            summary: [
                { required: true, message: '文章概述不能为空', trigger: 'change'}
            ]
        },
        typeList: [],
        tagList: []
    }
  },

    components: {
        mavonEditor
    },

    created() {
        this.fetchData()
    },

    methods: {
        fetchData() {
            getTags().then(res => {
                this.tagList = res.data
            })
            getTypes().then(res => {
                this.typeList = res.data
            })
        },
        publish(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.article.content == '') {
                        this.$message.warning("文章内容不能为空")
                        return
                    }
                    publish(this.article).then(res => {
                        if (res.flag) {
                            this.$message.success('发布成功')
                            this.$router.push('/')
                        }
                    })
                } else {
                    return false
                }
            })
        },
        handleEditorImgAdd(pos, $file){
            let formdata = new FormData()
            formdata.append('file', $file)
            //文件大小，单位M
            let fileSize = $file.size / 1024 / 1024
            if (fileSize < 1) {
                imgAdd(formdata).then(res => {
                    //console.log(res)
                    if (res.flag) {
                        let imgUrl = res.data
                        this.$refs.editor.$img2Url(pos, imgUrl)
                        this.$notify({
                            title: '提示',
                            message: res.message,
                            type: 'success'
                        })
                    } else {
                        this.$notify({
                            title: '提示',
                            message: res.message,
                            type: 'error'
                        })
                    }
                })
            } else {
                // this.$message.warning('文件大小不超过1M,请删除重新上传否则无法显示')
                this.$notify({
                    title: '提示',
                    message: '文件大小不超过1M,请删除重新上传否则无法显示',
                    type: 'error'
                })
            }
        }
    }
}
</script>

<style scoped>
.write-area {
  padding: 100px 0;
}
.article-from {
  padding: 15px 15px 55px 15px;
  background-color: #ffffff;
}
.publish {
  margin-top: 10px;
  float: right;
}
.markdown-body {
  z-index: 2;
}

.shadow5:before,
.shadow5:after {
  position: absolute;
  content: "";
  box-shadow: 0 10px 25px 20px rgba(0, 0, 0, 0.2);
  top: 40px;
  left: 10px;
  bottom: 50px;
  width: 15%;
  z-index: -1;
  -webkit-transform: rotate(-8deg);
  -moz-transform: rotate(-8deg);
  transform: rotate(-8deg);
}
.shadow5:after {
  /* -webkit-transform: rotate(8deg);
  -moz-transform: rotate(8deg);
  transform: rotate(8deg);
  right: 10px; */
  left: auto;
}

.shadow5 {
  position: relative;
  box-shadow: 10px -10px 15px -15px rgba(0, 0, 0, 0.5),
    -10px 10px 15px -15px rgba(0, 0, 0, 0.5);
}
</style>
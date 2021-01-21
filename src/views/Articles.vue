<template>
    <div>
        <banner></banner>
        <el-row :gutter="20" class="article-container">
            <el-col :span="5" id="left-area">
                <!-- 文章目录 -->
                <div id="article-menus">
                    <el-button type="primary" icon="el-icon-back" circle class="go-back animate__animated animate__bounceInLeft" @click="goBackOneStep"></el-button>
                    <div v-if="menus.length>0" class="article-entry animate__animated animate__bounceInLeft">
                        <menu-tree :menus="menus" child-label="child"></menu-tree>
                    </div>
                </div>
            </el-col>
            <el-col :span="14">
                <main class="site-main">
                    <article class="hentry">
                        <!-- 文章头部 -->
                        <header class="entry-header animate__animated animate__bounceInRight">
                            <!-- 标题 -->
                            <div class="header-container">
                                <div class="feature">
                                    <img :src="article.banner" />
                                </div>
                                <div class="breadcrumbs">
                                    <h1 class="entry-title">{{ article.title }}</h1>
                                    <div id="crumbs">发布日期：{{ article.pubTime }}</div>
                                </div>
                            </div>
                        </header>
                        <!-- 正文 -->
                        <div class="entry-content" id="entry-container">
                            <!-- v-highlight -->
                            <div id="write" class="markdown-body" v-html="compiledMarkdown"></div>
                        </div>
                        <!-- 文章底部 -->
                        <section-title>
                            <footer class="post-footer">
                                <!-- 阅读次数 -->
                                <div class="post-like">
                                    <i class="inconfont iconeyes"></i>
                                    <span class="count">{{ article.viewsCount }}</span>
                                </div>
                                <!-- 赞助按钮 -->
                                <div class="donate" @click="showDonate = !showDonate">
                                    <span>赏</span>
                                    <ul class="donate_inner" :class="{'show': showDonate}">
                                        <li class="wedonate"><img src="http://img.leftlevel.cn/0dddc2d6ea1b40b397d4a15ca02fdb96.jpg" >
                                            <p>微信</p>
                                        </li>
                                        <li class="alidonate"><img src="http://img.leftlevel.cn/e79c35382b81463388c77a1ba2ab19d2.jpg" >
                                            <p>支付宝</p>
                                        </li>
                                    </ul>
                                </div>
                                <!-- 文章标签 -->
                                <div class="post-tags">
                                    <i class="iconfont iconcategory"></i>
                                    <router-link :to="`/article/${article.id}`">{{ article.tag }}</router-link>
                                </div>
                            </footer>
                        </section-title>
                        <!-- 声明 -->
                        <div class="open-message">
                            <p>声明：leftlevel博客|版权所有，违者必究|如未注明，均为原创|本网站采用<a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank">BY-NC-SA</a>协议进行授权</p>
                            <p>转载：转载请注明原文链接 - {{ article.title }}</p>
                            <!-- <p>转载：转载请注明原文链接 - <a :href="`https://www.lesslesson.com/article/${article.id}`">{{ article.title }}</a></p> -->
                        </div>
                        <!-- 评论 -->
                        <div class="comment-count">
                            <i class="icon-ellipsisv"></i>
                            <span>全部评论（{{ article.commentsCount }}）</span>
                        </div>
                        <comment-message-editor id="editor" :inline="false" buttonText="评论" @submit="publishComment"></comment-message-editor>
                        <div class="comments">
                            <comment v-for="item in comments" :key="item.id" :comment="item" v-on:fetchComment="fetchComment"></comment>
                        </div>
                    </article>
                </main>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Banner from '@/components/banner'
import sectionTitle from '@/components/section-title'
import comment from '@/components/comment'
import commentMessageEditor from 'comment-message-editor'
import menuTree from '@/components/menu-tree'
import { fetchComment } from '../api'
import { getArticleById } from '../api/article'
import { insertComment, getComments } from '../api/comment'
import { checkLogin } from '../utils/auth'
import $ from 'jquery'
import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atelier-cave-light.css'

export default {
    name: 'articles',
    computed: {
        compiledMarkdown() {
            return marked(this.article.content).replace(/<pre>/g, "<pre class='hljs'>")
        }
    },
    data() {
        return {
            showDonate: false,
            comments: [],
            menus: [],
            article: {
                content: ''
            },
        }
    },
    components: {
        Banner,
        sectionTitle,
        comment,
        menuTree,
        commentMessageEditor
    },
    methods: {
        goBackOneStep() {
            this.$router.go(-1)
        },
        generateLeftAreaHeight() {
            let height = $("#entry-container").get(0).offsetHeight + 'px'
            $("#left-area").css('height', height)
        },
        getArticle() {
            getArticleById(this.$route.params.id).then(res => {
                if (res.flag) {
                    this.article = res.data
                    this.fetchComment()
                    this.$nextTick(() => {  //以下是需要数据渲染完成后对Dom进行操作
                        this.generateLeftAreaHeight()
                        this.createMenus()
                    })
                }
            })
        },
        publishComment(content) {
            if (checkLogin()) {
                const token = JSON.parse(localStorage.getItem("TOKEN_KEY"))
                const userString = decodeURIComponent(escape(window.atob(token.split('.')[1])))
                const user = JSON.parse(userString)
            
                insertComment({ articleId: this.article.id, content: content, fromUserAvatar: user.avatar, fromUserName: user.aud, toUserName: null}).then(res => {
                    if (res.flag) {
                        //console.log(res)
                        $('#editor .content').get(0).innerText = ''
                        this.fetchComment()
                        // this.$message.success(res.message)
                        this.$notify({
                            title: '提示',
                            message: res.message,
                            type: 'success'
                        })
                    }
                })
            }
        },
        fetchComment() {
            getComments(this.$route.params.id).then(res => {
                if (res.flag) this.comments = res.data
                this.article.commentsCount = this.comments.length
            })
        },
        fetchH(arr, left, right) {
            if (right) {
                return arr.filter(
                    (item) => item.offsetTop > left && item.offsetTop < right
                )
            } else {
                return arr.filter((item) => item.offsetTop > left)
            }
        },
        // 生成目录
        createMenus() {
            let arr = []
            for (let i = 6; i > 0; i--) {
                let temp = []
                let e = $(`.markdown-body h${i}`)
                for (let j = 0; j < e.length; j++) {
                    let child = this.fetchH(
                        arr,
                        e[j].offsetTop,
                        j + 1 === e.length ? undefined : e[j + 1].offsetTop
                    )
                    temp.push({
                        h: i,
                        title: e[j].innerText,
                        id: e[j].id,
                        offsetTop: e[j].offsetTop,
                        child,
                    })
                    //把原来的h里的文本添加一个span,不然markdown的css解析不了
                    let span = document.createElement('span')
                    span.innerText = e[j].innerText
                    e[j].removeChild(e[j].childNodes[0])
                    e[j].appendChild(span)
                }
                if (temp.length) {
                    arr = temp
                }
            }
            this.menus = arr
            //console.log(this.menus)
        },
    },
    mounted() {
    },
    created() {
        //markdown转html
        marked.setOptions({
            renderer: new marked.Renderer(),
            highlight: function (code) {
                return hljs.highlightAuto(code).value;
            },
            pedantic: false,
            gfm: true,
            tables: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });
        //this.getComment()
        this.getArticle()
    },
}
</script>
<style scoped lang="less">
@import "../assets/css/style.less";
@import "../assets/css/orangeheart.css";

.el-col {
  min-height: 1px;
}
#article-menus {
  position: sticky;
  top: 85px;
  .go-back {
    margin: 0 0 10px 20px;
  }
}
.article-entry {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  font-size: 14px;
  padding: 15px;
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.article-container {
  padding: 30px 10px 100px 10px;
  height: 100%;
}
#left-area {
  position: relative;
}
.header-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}
.feature {
  margin-right: 10px;
}
.feature img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  padding: 2px;
  border: 1px solid #dadada;
  position: relative;
  transition: all 0.2s linear;
  overflow: hidden;
  &:hover {
    transform: scale(1.1, 1.1);
    filter: contrast(130%);
  }
}
.comment-count {
  margin-bottom: 10px;
}

article.hentry {
  .entry-header {
    .entry-title {
      font-size: 23px;
      font-weight: 600;
      color: #737373;
      margin: 0.67em 0;

      &:before {
        // content: "#";
        margin-right: 6px;
        color: #d82e16;
        font-size: 20px;
        font-weight: 600;
      }
    }

    hr {
      height: 1px;
      border: 0;
      background: #efefef;
      margin: 15px 0;
    }

    .breadcrumbs {
      font-size: 14px;
      color: #c0c4cc;
      text-decoration: none;
      margin-bottom: 30px;
    }
  }

  footer.post-footer {
    width: 100%;
    padding: 20px 10px;
    margin-top: 30px;
    height: 65px;
    position: relative;
    i {
      font-size: 18px;
      margin-right: 5px;
    }
    .post-like {
      float: right;
      margin: 7px 0 0 20px;
    }

    .post-share {
      float: right;
      list-style: none;
      margin-right: 20px;
    }

    .donate {
      float: left;
      line-height: 36px;
      border-radius: 100%;
      -webkit-border-radius: 100%;
      -moz-border-radius: 100%;
      border: 1px solid #2b2b2b;
      &:hover {
        border: 1px solid goldenrod;
        span {
          color: goldenrod;
        }
      }
      span {
        color: #2b2b2b;
        padding: 10px;
        position: relative;
        cursor: pointer;
      }

      .donate_inner {
        display: none;
        margin: 0;
        list-style: none;
        position: absolute;
        left: 80px;
        top: -40px;
        background: #fff;
        padding: 10px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        border-radius: 3px;
        &.show {
          display: block;
        }
        li {
          float: left;
        }

        img {
          width: 100px;
        }
        p {
          text-align: center;
          font-size: 15px;
          color: #d2d2d2;
          line-height: 1rem;
        }
      }

      .donate_inner:after,
      .donate_inner:before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 45%;
        margin-left: -8px;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 8px solid #fff;
      }

      .donate_inner:before {
        left: -1px;
        border-right: 8px solid #ddd;
      }
    }

    .post-tags {
      margin: 7px 0 0 20px;
      float: left;
      text-transform: uppercase;
      a:hover {
        color: #ff6d6d;
      }
    }
  }
  .open-message {
    margin: 50px 0;
    position: relative;
    background: #2b2b2b;
    padding: 10px 30px;
    border-radius: 3px;
    font-size: 14px;
    color: #fff;
    &:after {
      content: "";
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #2b2b2b;
      position: absolute;
      top: -8px;
      left: 48%;
    }
    p {
      margin: 10px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    a {
      color: #a0dad0;
      padding: 0 5px;
    }
  }
}
</style>

<template>
    <div class="home">
        <banner isHome="true"></banner>
        <div class="site-content animate">
            <!--通知栏-->
            <div class="notify">
                <div class="search-result" v-if="hideSlogan">
                    <span v-if="searchWords">搜索结果："{{searchWords}}" 相关文章</span>
                    <span v-else-if="category">分类 "{{category}}" 相关文章</span>
                </div>
                <quote v-else>{{notice}}</quote>
            </div>

            <!--焦点图-->
            <div class="top-feature" v-if="!hideSlogan">
                <section-title>
                    <div style="display: flex;align-items: flex-end;">聚焦<small-ico></small-ico></div>
                </section-title>
                <div class="feature-content">
                    <div class="feature-item" v-for="item in features" :key="item.title">
                        <Feature :data="item"></Feature>
                    </div>
                </div>
            </div>
            
            <!--文章列表-->
            <main class="site-main" :class="{'search':hideSlogan}">
                <section-title v-if="!hideSlogan">推荐</section-title>
                <template v-for="item in postList">
                    <post :post="item" :key="item.id"></post>
                </template>
            </main>

            <!--加载更多-->
            <div class="more" v-show="hasNextPage">
                <div class="more-btn" @click="loadMore">More</div>
            </div>
            <!-- 底线 -->
            <div v-show="!hasNextPage">
                <div class="line">-------已经到底线啦-------</div>
            </div>
        </div>
        <!-- 公告栏 -->
        <notice class="notice"></notice>
    </div>
</template>

<script>
    import Banner from '@/components/banner'
    import Feature from '@/components/feature'
    import sectionTitle from '@/components/section-title'
    import Post from '@/components/post'
    import SmallIco from '@/components/small-ico'
    import Quote from '@/components/quote'
    import Notice from '@/components/notice'
    import {fetchFocus, fetchList, fetchListBySearchWords} from '../api'
    import { mapState } from 'vuex'
    import store from '@/store'

    export default {
        name: 'Home',
        props: ['cate', 'words'],
        data() {
            return {
                features: [],
                postList: [],
                currPage: 1,
                hasNextPage: false
            }
        },
        components: {
            Banner,
            Feature,
            sectionTitle,
            Post,
            SmallIco,
            Quote,
            Notice
        },
        computed: {
            // 获取Vuex中搜索框的state值,可以使用this.searchWords调用
            ...mapState(['searchWords']),
            // searchWords() {
            //     return this.$route.params.words
            // },
            category() {
                return this.$route.params.cate
            },
            hideSlogan() {
                return this.category || this.searchWords
            },
            notice() {
                return this.$store.getters.notice
            }
        },
        // 进入此页面前先将搜索框中原来的值置空
        beforeRouteEnter (to, from, next) {
            store.commit('SET_SEARCHWORDS', '')
            next()
        },
        // 监听搜索框内容变化
        watch: {
            searchWords(newWord, oldWord) {
                //loadMore后搜索重置当前页
                this.currPage = 1
                if (newWord != oldWord) {
                    fetchListBySearchWords({currentPage: this.currPage, searchWords: newWord}).then(res => {
                        this.postList = res.data.list || []
                        this.currPage = res.data.currPage
                        this.hasNextPage = res.data.hasNextPage
                    }).catch(error => {
                        console.log(err)
                    })
                }
            },
            // category(newType, oldType) {
            //     console.log(newType, oldType)
            //     this.currPage = 1
            //     if (newType != oldType) {
            //         fetchListBySearchWords({currentPage: this.currPage, searchWords: newType}).then(res => {
            //             this.postList = res.data.list || []
            //             this.currPage = res.data.currPage
            //             this.hasNextPage = res.data.hasNextPage
            //         }).catch(error => {
            //             console.log(err)
            //         })
            //     }
            // }
        },
        methods: {
            fetchFocus() {
                fetchFocus().then(res => {
                    this.features = res.data || []
                }).catch(err => {
                    console.log(err)
                })
            },
            fetchList() {
                fetchList({currentPage: this.currPage}).then(res => {
                    //easy-mock接口 this.postList = res.data.items || []
                    this.postList = res.data.list || []
                    //easy-mock接口 this.currPage = res.data.page
                    this.currPage = res.data.currPage
                    this.hasNextPage = res.data.hasNextPage
                }).catch(err => {
                    console.log(err)
                })
            },
            loadMore() {
                if (this.searchWords.length > 0) {
                    fetchListBySearchWords({currentPage: this.currPage+1, searchWords: this.searchWords}).then(res => {
                        this.postList = this.postList.concat(res.data.list || [])
                        this.currPage = res.data.currPage
                        this.hasNextPage = res.data.hasNextPage
                    })
                } else {
                    fetchList({currentPage: this.currPage+1}).then(res => {
                        //easy-mock接口 this.postList = this.postList.concat(res.data.items || [])
                        this.postList = this.postList.concat(res.data.list || [])
                        //easy-mock接口 this.currPage = res.data.page
                        this.currPage = res.data.currPage
                        this.hasNextPage = res.data.hasNextPage
                    })
                }
            }
        },
        mounted() {
            this.fetchFocus();
            this.fetchList();
        }
    }
</script>
<style scoped lang="less">

    .site-content {
        .notify {
            margin: 60px 0;
            border-radius: 3px;
            & > div {
                padding: 20px;
            }
        }


        .search-result {
            padding: 15px 20px;
            text-align: center;
            font-size: 20px;
            font-weight: 400;
            border: 1px dashed #ddd;
            color: #828282;
        }
    }

    .top-feature {
        width: 100%;
        height: auto;
        margin-top: 30px;

        .feature-content {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            position: relative;

            .feature-item {
                width: 32.9%;
            }
        }
    }

    .site-main {
        padding-top: 80px;

        &.search {
            padding-top: 0;
        }
    }

    .more{
        margin: 50px 0;
        .more-btn{
            width: 100px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #ADADAD;
            border: 1px solid #ADADAD;
            border-radius: 20px;
            margin: 0 auto;
            cursor: pointer;
            &:hover{
                color: #8fd0cc;
                border: 1px dashed #8fd0cc;
            }
        }
    }

    .line{
        text-align: center;
    }

    /******/
    @media (max-width: 800px) {
        .top-feature {
            display: none;
        }

        .site-main {
            padding-top: 40px;
        }

        .site-content {
            .notify {
                margin: 30px 0 0 0;
            }

            .search-result {
                margin-bottom: 20px;
                font-size: 16px;
            }
        }
    }

    .notice{
        position: absolute;
    }

    /******/
</style>

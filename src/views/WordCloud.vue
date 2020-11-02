<template>
    <div class="container">
        <div
            id="wordCloud"
            :style="{ width: '1200px', height: '300px' }"
            class="wordcloud animate__animated animate__jackInTheBox"
        ></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts-wordcloud/dist/echarts-wordcloud'
import 'echarts-wordcloud/dist/echarts-wordcloud.min'
import { getTags } from '@/api/article'

export default {
    name: "wordCloud",
    data() {
        return {
            tags: [],
        }
    },

    mounted() {
        this.fetchTags()
    },

    components: {},

    methods: {
        fetchTags() {
            getTags().then(res => {
                if (res.flag) {
                    this.createWordCloud(res.data)
                }
            })
        },
        createWordCloud(initData) {
            let wordCloud = echarts.init(document.getElementById('wordCloud'))
            let data = []
            for (var i = 0; i < initData.length; i++) {
                let obj = {}
                obj.name = initData[i].name
                obj.value = initData[i].id
                data.push(obj)
            }
            let option = {
                tooltip: {
                    show: true
                },
                series: [{
                    type: 'wordCloud',
                    shape: 'cardioid',
                    left: 'center',
                    top: 'center',
                    width: '70%',
                    height: '80%',
                    right: null,
                    bottom: null,
                    gridSize: 30,
                    sizeRange: [25, 60],
                     //用来调整词的旋转方向，，[0,0]--代表着没有角度，也就是词为水平方向
                    rotationRange: [-45, 45],
                    rotationSetp: 45,
                    drawOutOfBound: false,
                    //文字样式设置
                    textStyle: {
                        normal: {
                            fontFamliy: 'sans-serif',
                            fontWeight: 'bold',
                            color: function() {
                                //颜色随机生成
                                return 'rgb(' + [
                                    Math.round(Math.random() * 250),
                                    Math.round(Math.random() * 250),
                                    Math.round(Math.random() * 250),
                                ].join(',') + ')'
                            }
                        },
                        //鼠标划入样式
                        emphasis: {
                            //文字阴影模糊度
                            shadowBlur: 10,
                            //文字阴影颜色
                            shadowColor: '#333'
                        }
                    },
                    // Data is an array. Each array item must have name and value property.
                    data //data: data
                }]
            }
            wordCloud.setOption(option)
        }
    },
}
</script>

<style scoped>
.container {
    padding: 120px 0 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.wordcloud{
    animation-delay: 0.5s;
}
</style>
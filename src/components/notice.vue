 <template>
    <!-- 公告栏 -->
    <el-col :span="6" class="notice timeline-item  animate__animated animate__bounce" v-if="isMobile() && show">
        <div class="notice-box">
            <div class="notice-head">
                <i class="el-icon-message-solid">NOTICE</i>
            </div>
        </div>
        <div class="notice-box2">
            1.后台可登录账号：admin，密码：admin。<br />
            2.想到什么写什么
        </div>
    </el-col>
</template>
 
 <script>
export default {
    data() {
        return {
            screenWidth: document.body.clientWidth,
            show: true
        }
    },

    components: {},

    mounted() {
        /**浏览器窗口宽度变化 */
        window.onresize = () => {
            return(() => {
                window.screenWidth = document.body.clientWidth
                this.screenWidth = window.screenWidth
            })()
        }
    },

    methods: {
        isMobile() {
            let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
            if (flag) {
                return false
            } else {
                return true
            }
        }
    },
    watch: {
        screenWidth(newVal) {
            if (newVal < 1387) {
                this.show = false
            } else {
                this.show = true
            }
        }
    },
}
</script>
 
 <style scoped>
 .notice {
    width: 250px;
    height: 300px;
    top: 700px;
    right: 50px; /*定位右边*/
    overflow-y: auto;
    border-radius: 3px;
    box-shadow: 0 2px 12px 1px rgba(0, 0, 0, 0.1);
 }
 
.notice-box {
    height: 40px;
    border-bottom: 1px dashed #ececec;
}

.notice-head {
    margin-top: 30px;
    margin-left: 20px;
    color: rgb(38, 217, 230);
}

.notice-box2 {
    height: 220px;
    margin-top: 10px;
    margin-left: 10px;
    line-height: 30px;
}
</style>
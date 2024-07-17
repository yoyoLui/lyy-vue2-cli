// 初始化的main文件
const appFile = module => (`<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
import canvasWM from '@/libs/utils/waterDocument';

export default {
    mounted () {
        // this.init();
    },
    methods: {
        async init() {
            try {
                await this.$api.common.showCanvasWM({ activityId: 'whiteListAct20210128dLWl' });
                canvasWM({
                    content: '内部测试，请勿外传'
                });
            } catch (error) {
                console.log('不加水印');
            }
        }
    }
};
</script>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  scroll-behavior: smooth;
}
html,
body {
  height: 100%;
}
html {
  font-size: 10vw;
  @media screen and (min-width: 768px) {
    font-size: 76.8PX; /*no*/
  }
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
body {
  max-width: 768px;
  margin: 0 auto;
}
#app {
  -webkit-overflow-scrolling: touch;
  line-height: normal;
  font-family: PingFangSC-Regular, -apple-system-font, BlinkMacSystemFont,
    "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI",
    "Microsoft YaHei", Arial, sans-serif;
  font-size: 24px;
  img {
    flex-shrink: 0;
  }
  .widthFix {
    display: block;
    width: 100%;
  }
  .heightFix {
    display: block;
    height: 100%;
  }
}
#wk-loading {
  z-index: 9999 !important;
}
.wx-open-launch-weapp {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
`)

module.exports = appFile
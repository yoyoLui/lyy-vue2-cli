// 初始化的main文件
const mainFile = (needRouter, needVuex) => (`import Vue from 'vue';
import KTA from 'kcard-stats';
import sentryInit from 'kcard-sentry';
import VConsole from 'vconsole';
import {
    Toast,
    Dialog,
    Swipe,
    SwipeItem,
    Popup,
    Overlay
} from 'vant';
import sentryDsn from '@/libs/config/sentryDsn.js';
${needRouter ? "import router from './router';" : ""}
${needVuex ? "import store from './store';" : ""}
import App from './app.vue';
import components from './components';
import './style/index.scss';
import mixins from './mixins/index.js';
// 引入公用main.js部分
import '@/libs/common/mainComp.js';

Vue.mixin(mixins);
// 初始化sentry
sentryInit(Vue, NODE_ENV === 'production', sentryDsn);
if (window.location.hostname.includes('test') || process.env.NODE_ENV === 'development') {
    new VConsole();
}

// 组件
Vue.use(Toast)
    .use(Dialog)
    .use(Swipe)
    .use(Popup)
    .use(Overlay)
    .use(SwipeItem)
    .use(components);

// 只需配置appid，开启默认配置
window.KTAH5 = new KTA({
    appid: 'testappid',
    spa: 1
});
new Vue({
    el: '#app',${needRouter ? "\n    router," : ""}${needVuex ? "\n    store," : ""}
    render: h => h(App)
});
`)

module.exports = mainFile
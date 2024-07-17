// 初始化的main文件
const components = module => (`import api from '@/pages/${module}/api';

const install = (Vue) => {
    const contexts = require.context('.', false, /\\.vue$/);
    if (contexts.keys().length > 0) {
        contexts.keys().forEach((ele) => {
            const componentEntity = contexts(ele).default;
            Vue.component(ele.match(/\\.\\/(.*)\\.vue/)[1], componentEntity);
        });
    }
    Vue.prototype.$api = api;
};
export default install;
`)

module.exports = components
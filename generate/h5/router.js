// 初始化的路由文件
const routerFile = module => (`import Router from 'vue-router';
import Vue from 'vue';
import { JSAPI_default } from '@/libs/wx/index.js';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            component: () => import(/* webpackChunkName: "index" */'@/pages/${module}/views/index'),
            meta: {
                title: '首页'
            }
        }
    ]
});
// 注册导航守卫
router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
    const params = to.params.id ? JSON.stringify(to.params) : '';
    const title = to.meta.pvTitle + params || '';
    const referTitle = from.meta.pvTitle + params || '';
    window.KTAH5 && window.KTAH5.pvuvStat(title, referTitle);
});
router.afterEach(() => {
    JSAPI_default();
});
export default router;
`)

module.exports = routerFile

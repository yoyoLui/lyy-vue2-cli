// 初始化的路由文件
const vuexFile = module => (`import Vue from 'vue';
import Vuex from 'vuex';
import Api from '../api/index.js';

Vue.use(Vuex);

const initialUserInfo = {
    'phone': ''
};

const store = new Vuex.Store({
    state: {
        userInfo: {
            ...initialUserInfo
        },
        shareInfo: {
            title: '',
            subTitle: '',
            url: '',
            icon: ''
        }
    },
    mutations: {
        setUserInfo (state, data) {
            state.userInfo = Object.assign(state.userInfo, data);
        },
        setShareInfo (state, data) {
            const {
                title, subTitle, url, iconUrl: icon
            } = data;
            state.shareInfo = Object.assign(state.shareInfo, {
                title, subTitle, url, icon
            });
        }
    },
    actions: {
        getUserInfo ({ commit }) {
            return new Promise(async (resolve, reject) => {
                try {
                    const { data } = await Api.getUserInfo();
                    commit('setUserInfo', data);
                    resolve();
                } catch (error) {
                    console.log('获取UserInfo失败', error);
                    reject(error);
                }
            });
        },
        getShareInfo ({ commit }, env) {
            return new Promise(async (resolve, reject) => {
                try {
                    const { data } = await Api.shareConfig({ env });
                    commit('setShareInfo', data);
                    resolve();
                } catch (error) {
                    console.log('获取getShareInfo失败', error);
                    reject(error);
                }
            });
        }
    }
});

export default store;
`)

module.exports = vuexFile

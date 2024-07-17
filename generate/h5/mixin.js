// 初始化的main文件
const file = module => (`import { mapState } from 'vuex';
import { getQueryString } from 'kcard-utils';

export default {
    data () {
        return {
        };
    },
    computed: {
        mixinUA () {
            return this.$utils.checkUA();
        },
        ...mapState({
            'mixinUserInfo': state => state.userInfo
        })
    },
    filters: {
        // 把手机号5-8位替换为*
        formatAccount (account) {
            return String(account).replace(/(\d{4})\d{3}(\d{4})/, '$1****$2');
        }
    },
    methods: {
        getUrlString (str) {
            return getQueryString(str);
        },
        async $initShare ({
            type, callback, options
        } = {}) {
            const { shareInfo } = this.$store.state;
            if (!shareInfo || !shareInfo.title) {
                await this.$store.dispatch('getShareInfo', this.mixinUA.envStr);
            }
            console.log('正在初始化分享功能', shareInfo);
            this.$utils.initShare.call(this, {
                type, shareInfo, callback, options
            });
        },
        $kta (option) {
            console.log('埋点事件id: ' + option);
            this.$utils.kta.call(this, option);
        },
        getBannerList (id) {
            return new Promise(async (resolve, reject) => {
                try {
                    const { data } = await this.$api.common.getBannerList({ typeId: id });
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        },
        showMessage (error) {
            if (typeof error === 'string' || typeof error === 'number') {
                this.$dialog({ message: error || '系统繁忙，请稍后再试' });
            } else if (typeof error === 'object') {
                this.$dialog({ message: error.msg || error.message || '系统繁忙，请稍后再试' });
            }
        }
    }
};
`)

module.exports = file

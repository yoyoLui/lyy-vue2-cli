// 初始化的main文件
const apiFile = module => (`import Request from '@/libs/service/index.js';

const api = {
    common: {
        getBannerList (params) {
            return Request.post('/KCard/commonBanner/list', params);
        },
        showCanvasWM (params) {
            return Request.post('/KCard/baseAuthorize/showWaterRemark', params, {
                isLoading: false,
                isInformation: false
            });
        }
    },
    index: {
        getUserInfo (params) {
            return Request.get('/kcard-6th-anniversary/skating-game/userInfo', params, {
                isLoading: false
            });
        }
    }
};

export default api;
`)

module.exports = apiFile
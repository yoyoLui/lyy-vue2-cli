// 初始化的main文件
const file = module => (`import { JSAPI_default } from '@/libs/wx/index.js';
import { getQueryString } from 'kcard-utils';
import WXS from 'kcard-wxsubscribe';
import { shareUnicomClient } from '@/libs/utils/shareUnicomClient.js';

const channel = getQueryString('channel') || '';

// 设置腾讯视频分享信息
function setTxVideoShareInfo ({ shareInfo, callback }) {
    const {
        title, subTitle, url, icon: imageUrl
    } = shareInfo;
    window.atom.invoke('setMoreInfo', {
        hasRefresh: true,
        hasShare: true,
        shareInfo: {
            title,
            subTitle,
            imageUrl,
            url
        }
    }).then(() => {
        console.log('设置成功');
        callback && callback();
    });
}

// 腾讯视频分享功能
function initTxVideoShare ({ shareInfo, callback, options = { txVideoShow: false } }) {
    if (!window.atom) {
        const vqqJS = document.createElement('script');
        vqqJS.src = 'https://vm.gtimg.cn/tencentvideo/script/film/common/lib/atom.lite.js';
        vqqJS.onload = (() => {
            if (window.atom) {
                setTxVideoShareInfo({ shareInfo, callback });
                if (options.txVideoShow) {
                    window.atom.invoke('openToolsDialog');
                }
            }
        });
        document.body.appendChild(vqqJS);
    } else {
        setTxVideoShareInfo({ shareInfo, callback });
        if (options.txVideoShow) {
            window.atom.invoke('openToolsDialog');
        }
    }
}

// 设置QQ分享信息
function setQQShareInfo ({ shareInfo, callback }) {
    const {
        title, subTitle: desc, url: link, icon: imgUrl
    } = shareInfo;
    const shareParam = {
        title,
        desc,
        share_url: link,
        image_url: imgUrl,
        sourceName: '腾讯王卡',
        source_name: '腾讯王卡'
    };
    console.log('QQ shareParam', shareParam);
    window.mqq.data.setShareInfo(shareParam);
    callback && callback();
}

// QQ分享功能
function initQQShare (param) {
    if (!window.mqq) {
        const qqJS = document.createElement('script');
        qqJS.src = 'https://open.mobile.qq.com/sdk/qqapi.js?_bid=152';
        qqJS.onload = (() => {
            setQQShareInfo(param);
        });
        document.body.appendChild(qqJS);
    } else {
        setQQShareInfo(param);
    }
}

// 微信分享功能
function initWxShare ({ shareInfo, callback, options } = {}) {
    return new Promise((resolve) => {
        const {
            title, subTitle: desc, url: link, icon: imgUrl
        } = shareInfo;
        JSAPI_default(
            ['showMenuItems', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'],
            () => {
                wx.showMenuItems({
                    menuList: [
                        'menuItem:share:appMessage',
                        'menuItem:share:qq',
                        'menuItem:share:QZone',
                        'menuItem:share:weiboApp'
                    ]
                });
                // 分享给朋友
                wx.onMenuShareAppMessage({
                    title, // 分享标题
                    desc, // 分享描述
                    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl,
                    success () {
                        // 用户点击了分享后执行的回调函数
                        callback && callback();
                    }
                });
                wx.updateAppMessageShareData({
                    title, // 分享标题
                    desc, // 分享描述
                    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl,
                    success () {
                        // 用户点击了分享后执行的回调函数
                        callback && callback();
                    }
                });
                // 分享到QQ
                wx.onMenuShareQQ({
                    title,
                    desc,
                    link,
                    imgUrl, // 分享图标
                    success () {
                        // 用户确认分享后执行的回调函数
                        callback && callback();
                    },
                    cancel () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                // 分享到腾讯微博
                wx.onMenuShareWeibo({
                    title, // 分享标题
                    desc, // 分享描述
                    link, // 分享链接
                    imgUrl, // 分享图标
                    success () {
                        // 用户确认分享后执行的回调函数
                        callback && callback();
                    },
                    cancel () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                // 分享到QQ空间
                wx.onMenuShareQZone({
                    title, // 分享标题
                    desc, // 分享描述
                    link, // 分享链接
                    imgUrl, // 分享图标
                    success () {
                        // 用户确认分享后执行的回调函数
                        callback && callback();
                    },
                    cancel () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                resolve();
            }, options
        );
    });
}

// 手厅分享功能
function initUnicomShare ({ shareInfo, callback, options } = {}) {
    const {
        title, subTitle: desc, url: link, icon: imgUrl
    } = shareInfo;
    if (options.stHide) {
        shareUnicomClient({
            hide: true
        });
        return;
    }
    shareUnicomClient({
        shareType: options.stType, // default: 默认只设置分享信息（通过菜单栏分享），button：弹出分享按钮
        title,
        desc,
        link,
        imgUrl
    });
    callback && callback();
}
// 设置埋点
export function kta (option) {
    if (typeof option === 'string') {
        window.KTAH5 && window.KTAH5.clickStat(option, { env: checkUA().envStr });
    } else if (typeof option === 'object') {
        window.KTAH5 && window.KTAH5.clickStat(option.eventId, { env: checkUA().envStr, ...option });
    }
}
// 设置微信订阅
export function wxSubscribe (option) {
    return new Promise((resolve, reject) => {
        new WXS({
            env: option.env,
            el: option.el,
            templateId: option.templateId,
            seq: option.seq,
            action_id: option.templateId,
            scene: option.scene,
            extra_data: option.extra_data,
            text: option.text,
            style: option.style,
            // 订阅调用成功回调函数
            success (e) {
                resolve(e);
            },
            // 订阅调用失败回调函数
            error (e) {
                reject(e);
            }
        });
    });
}
export function initShare ({
    type, shareInfo, callback, options = {
        stHide: false, stType: 'default', txVideoShow: false, isLoading: true, isInformation: true
    }
} = {}) {
    if (!type) {
        type = checkUA().envStr;
    }
    switch (type) {
        case 'qq':
            initQQShare({ shareInfo, callback, options });
            break;
        case 'txVideo':
            initTxVideoShare({ shareInfo, callback, options });
            break;
        case 'weixin':
            initWxShare({ shareInfo, callback, options });
            break;
        case 'shouting':
            initUnicomShare({ shareInfo, callback, options });
            break;
        default:
            break;
    }
}

// 获取绑定链接
export function getBindUrl (redirectUrl = window.location.href, env) {
    const { host, protocol } = window.location;
    const origin = window.location.origin || protocol + '//' + host;
    const { isWeChat } = checkUA();
    if (!env) {
        if (isWeChat) { // 微信环境
            env = 'wx_bind';
        } else { // 非微信环境
            env = 'phone';
        }
    }
    return \`\${origin}/KCardAuth/redirect?env=\${env}&redirectUrl=\${encodeURIComponent(redirectUrl)}\`;
}

// 获取绑定链接
export function goBindUrl (redirectUrl = window.location.href, env) {
    const { host, protocol } = window.location;
    const origin = window.location.origin || protocol + '//' + host;
    const { isWeChat } = checkUA();
    if (!env) {
        if (isWeChat) { // 微信环境
            env = 'wx_bind';
        } else { // 非微信环境
            env = 'phone';
        }
    }
    window.location.href = \`\${origin}/KCardAuth/redirect?env=\${env}&redirectUrl=\${encodeURIComponent(redirectUrl)}\`;
}

// 获取浏览器环境
export function checkUA () {
    let isIOS;
    let isAndroid;
    let isWeChat = false;
    let isUnicom = false;
    let isQQ = false;
    let isTxVideo = false;
    let envStr = 'app';
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
        isIOS = true;
        isAndroid = false;
    } else if (/android/.test(ua)) {
        isIOS = false;
        isAndroid = true;
    }
    if (/micromessenger/.test(ua)) {
        isWeChat = true;
        envStr = 'weixin';
    }
    if (/unicom/.test(ua)) {
        isUnicom = true;
        envStr = 'shouting';
    }
    if (!isWeChat) {
        if (/qqlivebrowser\\/[0-9]/.test(ua)) {
            isTxVideo = true;
            envStr = 'txVideo';
        } else if (/qq\\/[0-9]/.test(ua)) {
            isQQ = true;
            envStr = 'qq';
        }
    }
    return {
        isIOS,
        isAndroid,
        isWeChat,
        isUnicom,
        isQQ,
        isTxVideo,
        envStr
    };
}

export function getChannel () {
    return channel;
}
`)

module.exports = file
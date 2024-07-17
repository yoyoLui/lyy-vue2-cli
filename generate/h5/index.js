const routeTemplate = require('./router')
const vuexTemplate = require('./vuex')
const mainTemplate = require('./main')
const mixinTemplate = require('./mixin')
const utilsTemplate = require('./utils')
const appTemplate = require('./app')
const commonVue = require('./commonVue')
const apiTemplate = require('./api')
const componentsTemplate = require('./components')
const styleTemplate = require('./style')

// 需要创建的目录及其内部文件,dirList为当前目录下的目录列表，fileList为当前目录下的文件列表
const init = (moduleName, { needRouter = true, needVuex = true } = {}) => {
    return [
        {
            name: moduleName,
            fileList: [
                { name: 'main.js', content: mainTemplate(needRouter, needVuex) }
                , { name: 'app.vue', content: appTemplate() }
            ],
            dirList: Array.prototype.concat.call([
                {
                    name: 'components',
                    dirList: [],
                    fileList: [{ name: 'index.js', content: componentsTemplate(moduleName) }]
                },
                {
                    name: 'api',
                    dirList: [],
                    fileList: [{ name: 'index.js', content: apiTemplate() }]
                },
                { name: 'style', dirList: [], fileList: [{ name: 'index.scss', content: styleTemplate() }] },
                { name: 'mixins', dirList: [], fileList: [{ name: 'index.js', content: mixinTemplate() }] },
                { name: 'utils', dirList: [], fileList: [{ name: 'index.js', content: utilsTemplate() }] },
                { name: 'assets', dirList: [], fileList: [] },
                {
                    name: 'views',
                    dirList: [{
                        name: 'index',
                        fileList: [{ name: 'index.vue', content: commonVue() }]
                    }]
                }
            ], needRouter ? {
                name: 'router',
                dirList: [],
                fileList: [{ name: 'index.js', content: routeTemplate(moduleName) }]
            } : [],
                needVuex ? {
                    name: 'store',
                    dirList: [],
                    fileList: [{ name: 'index.js', content: vuexTemplate(moduleName) }]
                } : [])
        }
    ];
}

module.exports = init
const { prompt } = require('inquirer')
const program = require('commander')
const { generateModule } = require('../generate')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

const errorLog = log => console.log(chalk.red(`${log}`))
const resolve = file => path.resolve(process.cwd(), './', file)
const option = program.parse(process.argv).args[0]
const defaultName = typeof option === 'string' ? option : undefined


const getDirList = (pathStr) => {
    let files = fs.readdirSync(pathStr);
    return files.filter(function (item) {
        let fPath = path.join(pathStr, item);
        let stat = fs.statSync(fPath);
        return stat.isDirectory() === true
    });
}
// 获取范例模板
const templateList = getDirList(path.resolve(__dirname, '../generate'))

const questions = [
    {
        type: 'input',
        name: 'moduleName',
        message: '请确认项目名称:',
        default: defaultName,
        filter(val) {
            return val.trim()
        },
        async validate(val) {
            if (!val) {
                return '项目名不能为空';
            }
            if (await fs.existsSync(resolve(val))) {
                return '项目名已经存在';
            }
            // 若有空格
            const validate = (val.trim().split(" ")).length === 1
            return validate || '项目名内不能有空格';
        },
        transformer(val) {
            return val;
        }
    }, {
        type: 'list',
        name: 'template',
        message: '请选择模板',
        choices: templateList,
        default: templateList[0],
    },
    {
        type: 'list',
        name: 'needRouter',
        message: '是否需要vue-router:',
        choices: ['Y', 'N'],
        default: 'Y',
        filter(val) {
            return val === 'Y'
        }
    }, {
        type: 'list',
        name: 'needVuex',
        message: '是否需要vuex:',
        choices: ['Y', 'N'],
        default: 'Y',
        filter(val) {
            return val === 'Y'
        }
    }
]

// 如果npm输入打了-y，则直接默认全部生成
if (program.yes) {
    if (!defaultName) {
        errorLog('请正确使用: bdg init <projectName> -y')
        process.exit()
    }
    if (fs.existsSync(resolve(defaultName))) {
        errorLog('项目名已经存在')
        process.exit()
    } else {
        questions.splice(0)
    }
}

module.exports = prompt(questions).then(({ moduleName = defaultName, template = templateList[0], needRouter = true, needVuex = true }) => {
    generateModule(moduleName, template, needRouter, needVuex)
})
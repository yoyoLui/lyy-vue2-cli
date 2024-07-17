const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const ora = require('ora')
const execSync = require('child_process').execSync

const resolve = file => path.resolve(process.cwd(), './', file)
const dividerLine = log => console.log(chalk.yellow(log || "=================="))
const defaultLog = log => console.log(chalk.green(`${log}`))
const errorLog = log => console.log(chalk.red(`${log}`))

const installPlugins = async (needRouter, needVuex) => {
    let installPluginsStr = ''
    if (needVuex) {
        try {
            await execSync('npm list vuex')
        } catch (error) {
            installPluginsStr += 'vuex '
        }
    }
    if (needRouter) {
        try {
            await execSync('npm list vue-router')
        } catch (error) {
            installPluginsStr += 'vue-router '
        }
    }
    if (installPluginsStr) {
        await execSync(`npm install ${installPluginsStr} --save`)
    }
}

// 生成模块
const generateModule = async (moduleName, template, needRouter, needVuex) => {
    try {
        const spinner = ora('正在生成项目中...');
        spinner.start();

        installPlugins(needRouter, needVuex)

        await generateDirs(require('./' + template)(moduleName, { needRouter, needVuex }), resolve(''))

        spinner.stop();
        dividerLine()
        defaultLog(`创建项目 ${moduleName} 成功`)
        // 退出
        process.exit()
    } catch (error) {
        errorLog(error)
        // 退出
        process.exit()
    }
}

// 生成目录
const generateDirs = async (dirList, dirListPath) => {
    return new Promise(async (resolved) => {
        for (let i = 0; i < dirList.length; i++) {
            const ele = dirList[i];
            // 获得需要创建的目录的路径
            const dirPath = path.join(dirListPath, ele.name)

            // 创建目录
            await fs.mkdirSync(dirPath)

            // ele.dirList存在且有内容，说明需要创建目录下对应的目录
            if (ele.dirList && ele.dirList.length > 0) {
                await generateDirs(ele.dirList, dirPath)
            }

            // 创建目录下的文件列表
            if (ele.fileList && ele.fileList.length > 0) {
                ele.fileList.forEach(async file => {
                    const filePath = path.join(dirPath, file.name)
                    await fs.writeFileSync(filePath, file.content, 'utf8')
                })
            }
        }
        resolved()
    })
}

module.exports = { generateModule }

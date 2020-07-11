#!/usr/bin/env node

// 添加gulp cli参数来寻找包下的gulpfile.js
// process.argv当前命令所有参数
process.argv.push('--cwd') // 当前项目运行的目录
process.argv.push(process.cwd()) // 当前命令行所在的目录

process.argv.push('--gulpfile') // gulpfile所在目录
process.argv.push(require.resolve('..')) // require.resolve这个模块所在路径, '..'会主动找package.json下的'main'对应的目录

// console.log(process.argv)
require('gulp/bin/gulp')
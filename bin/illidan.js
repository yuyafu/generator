#!/usr/bin/env node --harmony
'use strict'

process.env.NODE_PATH = __dirname + '/../node_modules/'
const program = require('commander')


program.version(require('../package').version)

program.usage('<command>')


program.command('init')
.description('init app template')
.alias('i')
.action(()=>{
	require('../src/init/index')()
})

program.command('add <module> <name>')
.description('add module template')
.alias('a')
.action((module,name)=>{
	require('../src/add/index')(module,name)
})
.on('--help',()=>{
	console.log(`
	Examples:
		illidan add project example
	`)
}) 

program.parse(process.argv)

if(!program.args.length){
	program.help()
}
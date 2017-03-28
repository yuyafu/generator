const prompt = require('co-prompt')
const chalk = require('chalk')


module.exports = {
	normal:(content)=>{
		return prompt(content)
	},
	info:(content)=>{
		return prompt(chalk.green(content))
	},
	error:(content)=>{
		return prompt(chalk.bold.red(content))
	},
	success:(content)=>{
		return prompt(chalk.bgGreen(content))
	}
}
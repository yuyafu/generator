const chalk = require('chalk')


module.exports = {
	error:(content)=>{
		console.log(chalk.red.underline(content))
	},
	success:(content)=>{
		console.log(chalk.bgGreen.white(content))
	},
	info:(content)=>{
		console.log(content)
	}
}
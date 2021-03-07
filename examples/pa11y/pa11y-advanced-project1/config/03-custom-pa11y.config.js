const commander = require('commander');

const config = {
	urls: [
			
		],

	defaults: {
		log: (commander.json || commander.htmlReport) ? undefined : console,
		wrapWidth: process.stdout.columns || undefined,
		timeout: 120000,
		concurrency: 20,
		standard: 'WCAG2AA', // Section508, WCAG2A, WCAG2AA (default), WCAG2AAA

		ignore: [

			],  
		runners: [
			'axe',
			'htmlcs'
		] 


	}
};

module.exports = config;
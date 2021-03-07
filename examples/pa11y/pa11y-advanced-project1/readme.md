# pa11y advanced examples: Project 1

---

Go to the [GitHub Playbook-Automation published page](https://section508coordinators.github.io/Dev-Automation/)

---

# pa11y engine: Customizing functionality

This project is meant to demonstrate multiple ways in which developers can use and combine various pa11y test engine functionality using different configurations as follows:

- **URL Scanning**: Using the "URLs:" option, cite the identity and number of URLs to test against from within the script itself or use the sitemap switch (-s)  to use a sitemap.xml file of URLs to test against.
- **Accessibility Standards**: Using the "standard:" option, indicate which accessibility standard rules to use for testing.
- **Ruleset**: Using the "runners:" option, indicate which vendor ruleset you wish to use. Pa11y allows you to select one or combine multiple rulesets. Pa11y currently supports axe-core, HTML CodeSniffer, and any other custom ruleset created to match the Pa11y engine requirements.
- **Individual rule selection**: By default, pa11y will use all rules in an identified ruleset for testing. If you don't want Pa11y to use all rules but rather use a subset of preferred rules, you do this by citing which rules you want pa11y to ***ignore***.  You do this in Pa11y by using the "ignore:" configuration option. 

- **HTML Reporting/Scoring**: using the HTML report switch (-h), this example provides summaries of rules that fail accessibility and  a simple scoring model for mass scan results. 

---

## Automated tools and rulesets

#### Ruleset assessments and recommended rules

This tool allows the user to pick and choose the individual, underlying rules for testing. Not all automated tool rulesets on the market perfectly align with the pass/fail success criteria as expressed by the DHS standard. However upon analysis, DHS OAST has identified specific rules, for specific vendor accessibility ruleset libraries, that provide value in identifying accessibility to the DHS Standard.

Those analyses of vendor accessibility rulesets and the OAST ruleset recommendations reside in [rulesets folder](/rulesets) on this site.

---

## Technology requirements

This example uses the following technology stack:

- Nodejs 6+

- Git

- axe-Puppeteer

- Commander

- Globby

- pa11y-ci-reporter-html

- protocolify

- puppeteer

- sitemapper
  

---

## Setup

Git and Node.js needs to be available on your system. Also, there is a peer dependency on puppeteer. This means that in addition to running `npm install` you will need to run `npm install puppeteer`.

```sh
npm install
npm install puppeteer --no-save
```


## Usage/syntax

Project1 can be used by running it as a command line tool, `custom-pa11y`from the /bin/ folder:

```
Usage: node custom-pa11y.js [options] <paths>

Options:
  -V, --version                    output the version number
  -s, --sitemap <url>              the path to a sitemap
  -f, --sitemap-find <pattern>     a pattern to find in sitemaps. Use with
                                   --sitemap-replace
  -r, --sitemap-replace <string>   a replacement to apply in sitemaps. Use with
                                   --sitemap-find
  -x, --sitemap-exclude <pattern>  a pattern to find in sitemaps and exclude
                                   any url that matches
  -h, --html-report <dir>          Takes json output and uses
                                   pa11y-ci-reporter-html to generate a report
                                   in <dir>
  -h, --help                       display help for command
  -c, --config <string>            Use an alternate configuration for this analysis,
                                   default file: config/custom-axe.config.js
  -t, --template <string>          Use an alternate template for this analysis,
                                   default file: config/index.handlebars
```

### Example implementation of switches

In a git bash window, run the following command from the /bin/ directory:

`node custom-pa11y.js --config config/custom-pa11y.config.js --template config/index.handlebars -h HTML_Report https://www.saga-it.com`

This will run an accessibility test against a test web site of multiple web pages, with the configuration that is set with the **--config** option and using the template that is set with the **--template** option a folder will be created with the name "***HTML_Report***". Inside that folder will be index.html file of that report, it will display the test results and the score..

## Pre-configured examples

The /bin/ directory contains multiple "custom-pa11y" files that showcase different features via their configuration settings as follows:

- **Script 1 (01-custom-pa11y.js)**: 
  Use the following syntax for this script:`node custom-pa11y.js --config config/01-custom-pa11y.config.js --template config/index.handlebars -h HTML_Report https://www.saga-it.com`This script presents the following:
  - Uses the "runners:" option to specify the HTML CodeSniffer ruleset to use for testing. No rules are ignored, so testing is done using the full range of rules.
- **Script 2 (02-custom-pa11y.js):** 
  Use the following syntax for this script:`node custom-pa11y.js --config config/02-custom-pa11y.config.js --template config/index.handlebars -h HTML_Report https://www.saga-it.com`This script presents the following:
  - Uses the "runners:" option to specify the axe-core ruleset to use for testing. No rules are ignored, so testing is done using the full range of rules.
  - Uses the "urls:" option and tests against 1 URL that is hard-coded inside the script, as opposed to pointing to a sitemap file.
- **Script 3 (03-custom-pa11y.js):** 
  Use the following syntax for this script:`node custom-pa11y.js --config config/03-custom-pa11y.config.js --template config/index.handlebars -h HTML_Report https://www.saga-it.com`This script presents the following:
  - Uses the "runners:" option to specify both the axe-core and HTML CodeSniffer rulesets to be used for testing. No rules are ignored, so testing is done using the full range of all rules from both rulesets.
- **Script 4 (04-custom-pa11y.js):** 
  Use the following syntax for this script:`node custom-pa11y.js --config config/04-custom-pa11y.config.js --template config/index.handlebars -h HTML_Report https://www.saga-it.com`This script presents the following:
  - Uses the "runners:" option to specify both the axe-core and HTML CodeSniffer rulesets to be used for testing. 
  - Uses the "ignore" option to specific rules to ignore for both rulesets specififed

## The syntax of the config files

- **Urls**: urls can be a string or a function, functions would use in case the url needs authentication, functions take a browser puppeteer that can be used to perform certain actions before returning the url to run against axe.

  Login function example:

  ```
    async (puppet) => {
	    // log into site before running tests and push the post login page onto
		  const page = await puppet.newPage();
		  await page.goto('http://testing-ground.scraping.pro/login');
		  await page.waitForSelector('#usr', {visible: true});

		  // Fill in and submit login form.
		  const emailInput = await page.$('#usr');
		  await emailInput.type('admin');
		  const passwordInput = await page.$('#pwd');
		  await passwordInput.type('12345');
		  const submitButton = await page.$('input[type=submit]');

	    await Promise.all([
		    submitButton.click(),
		    page.waitForNavigation(),
		  ]);

		  if (page.url() != 'http://testing-ground.scraping.pro/login?mode=welcome') {
		    console.error('login failed!');
		  } else {
		    console.log('login succeeded');
		    const cookies = await page.cookies();
		    for (var key in cookies) {
		      console.log(`found cookie ${cookies[key].name}`);
		    }
		  }
		  await page.close();

		  return 'http://testing-ground.scraping.pro/login?mode=welcome';
		},
  ```

- **defaults**: inside the axeConfig object the configuration is set up.

    - **ignore**: the rules to be ignored are added or modified.

## Configure the handlebars templates

to modify any title, is to search inside the template and change the text

to hide the table, go to the **style** tag and look for the **table** styles and add **display: none**.

to hide the chart, you must comment out the script tag and comment out the tag containing the id accessibilityChart.
# More information

For more information on syntax for using this custom example, see the pa11y-ci syntax information here: https://github.com/pa11y/pa11y-ci 

---

03/06/2021 | 10:03p

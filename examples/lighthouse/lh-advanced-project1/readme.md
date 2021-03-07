# lighthouse advanced examples: Project 1

---

Go to the [GitHub Playbook-Automation published page](https://section508coordinators.github.io/Dev-Automation/)

---


# lighthouse: Customizing functionality

This project is meant to demonstrate multiple ways in which developers can use and combine various lighthouse test engine functionality using different configurations as follows:

- **URL Scanning**: Using the "URLs:" option, cite the identity and number of URLs to test against from within the script itself or use the sitemap switch (-s)  to use a sitemap.xml file of URLs to test against.
- **Individual rule selection**: The underlying ruleset used by lighthouse is the Deque axe-core ruleset.  If you don't want to use all axe-core rules usually used by lighthouse but would rather use a subset of preferred rules, you do this by using the "skipAudits:" configuration option to exclude the rule(s) to be used.
- **HTML Reporting/Scoring**: using the HTML report switch (-h), this example provides summaries of rules that fail accessibility and  a simple scoring model for mass scan results. 

---

## Automated tools and rulesets


#### Ruleset assessments and recommended rules

This tool allows the user to pick and choose the individual, underlying rules for testing. Not all automated tool rulesets on the market perfectly align with the pass/fail success criteria as expressed by the DHS standard. However upon analysis, DHS OAST has identified specific rules, for specific vendor accessibility ruleset libraries, that provide value in identifying accessibility to the DHS Standard.

Those analyses of vendor accessibility rulesets and the OAST ruleset recommendations reside in [rulesets folder](/rulesets) on this site.

#### Lighthouse and axe-core rulesets

Note that Deque axe-core open-source rules are the underlying rules for lighthouse accessibility testing, however the scope of rules exposed with lighthouse testing do not match the full range of axe-core rules as exposed through the full axe-core API. 

##### Review axe-core rules tested with Lighthouse

To see the axe-core rules exposed via Lighthouse testing:

- Issue the command: `lighthouse --list-all-audits` and then note all listings with a preface of "**accessibility/**".
- Reference the Lighthouse section of the [rulesets folder](/rulesets) on this site for a listing of those rules.

To access the full range of axe-core rules, use the the [axe-core test tools](/examples/axe-core/) on this site.

---

## Technology requirements

This example uses the following technology stack:

- Chrome desktop
- Nodejs 12+
- Git
- cheerio
- Commander
- Globby
- handlebars
- lighthouse
- axe-core
- node-fetch
- protocolify
- puppeteer
- typescript


---

## Setup

Git and Node.js needs to be available on your system. 

```sh
npm install
npm install puppeteer --no-save
```


## Usage/syntax

Project1 can be used by running it as a command line tool, `custom-pa11y`from the /bin/ folder:


```
Usage: node custom-lighthouse.js [options] <paths>

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

`node custom-lighthouse.js --config config/01-custom-lighthouse.config.js --template config/index.handlebars -h HTML_Report https://www.saga-it.com`

This will run an accessibility test against a test web site of multiple web pages, with the configuration that is set with the **--config** option and using the template that is set with the **--template** option a folder will be created with the name "***HTML_Report***". Inside that folder will be index.html file of that report, it will display the test results and the score.

## Pre-configured examples

The /config/ directory contains multiple files with different configurations in each file, which show different features through their configuration settings as follows. Use the **--config** option to select any .js file found inside the /config/ directory:

- **Script 1 (01-custom-lighthouse.js)**: 
  Use the following syntax for this script:`node custom-lighthouse.js --config config/01-custom-lighthouse.config.js --template config/index.handlebars -h HTML_Report https://www.saga-it.com'`This script presents the following:
  - Uses the "urls:" option and tests against 5 URLs that are hard-coded inside the script, as opposed to pointing to a sitemap file.
  - Does not constrain rules and therefore runs against all axe-core rules lighthouse runs by default.
- **Script 2 (02-custom-lighthouse.js):** 
  Use the following syntax for this script:`node custom-lighthouse.js --config config/02-custom-lighthouse.config.js --template config/index.handlebars -h HTML_Report https://www.saga-it.com`This script presents the following:
  - Uses the "runners:" option to specify the axe-core ruleset to use for testing. No rules are ignored, so testing is done using the full range of rules.
  - Instead of using all axe-core rules, uses the "onlyAudits:" option to specify rules to use for testing

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

- **lighthouse**: inside the lighthouse object the configuration is set up.

    - **onlyAudits**: within the config object, the settings object is located and within this object is the **onlyAudits ** field, in  this field you can add or modify the audits.

    - **skipAudits**: inside the flag object, inside this object there is the **skipAudits ** field, in this field you can add or modify the audits you want to skip.

## Configure the handlebars templates

to modify any title, is to search inside the template and change the text

to hide the table, go to the **style** tag and look for the **table** styles and add **display: none**.

to hide the chart, you must comment out the script tag and comment out the tag containing the id accessibilityChart.

# More information

For more information on lighthouse syntax, go here: https://github.com/GoogleChrome/lighthouse.

---

02/21/2021 | 03:03p


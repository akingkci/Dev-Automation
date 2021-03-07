# axe-core advanced examples: Project 1

---

Go to the [GitHub Playbook-Automation published page](https://section508coordinators.github.io/Dev-Automation/)

---


# Tool: Custom extended functionality

This project is meant to demonstrate one of multiple ways in which developers can use and combine various axe-core API functionality and other vendor tools to extend and expand functionality. 

By combining the axe-core API library with the underlying [Pa11y test engine](https://github.com/pa11y/pa11y), this example broadens the possibilities when performing accessibility testing and reporting to maximize effectiveness. These features include:

- **URL Scanning**: Using the "URLs:" option, cite the identity and number of URLs to test against from within the script itself or use the sitemap switch (-s)  to use a sitemap.xml file of URLs to test against.
- **Individual rule selection**: Using the "rules:" option, enable or disable the underlying rules you want to use for testing. 

- **HTML Reporting/Scoring**: Using the HTML report switch (-h), this example provides summaries of rules that fail accessibility and  a simple scoring model for mass scan results. 

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

Project1 can be used by running it as a command line tool, `custom-axe` from the /bin/ folder:

```
Usage: node custom-axe.js [options] <paths>

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

`node custom-axe.js --config config/custom-axe.config.js --template config/index.handlebars -h HTML_Report https://www.saga-it.com`

This will run an accessibility test against a test web site of multiple web pages, with the configuration that is set with the **--config** option and using the template that is set with the **--template** option a folder will be created with the name "***HTML_Report***". Inside that folder will be index.html file of that report, it will display the test results and the score.

## Pre-configured examples

The /config/ directory contains multiple files with different configurations in each file, which show different features through their configuration settings as follows. Use the **--config** option to select any .js file found inside the /config/ directory:

- **Run all axe rules when testing**: 01-custom-axe.js.

- **Run only certain rules that are TTv5 friendly**: 02-custom-axe.js

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

- **axeConfig**: inside the axeConfig object the configuration is set up.

    - **tags**: tags can be used to select groups of tests.

    - **checks**: can define new checks or override existing.

    - **disableOtherRules**: if true, only use our rules.

    - **rules**: define new rules or override existing. 

## Configure the handlebars templates

to modify any title, is to search inside the template and change the text

to hide the table, go to the **style** tag and look for the **table** styles and add **display: none**.

to hide the chart, you must comment out the script tag and comment out the tag containing the id accessibilityChart.

<hr>

## More information

More comprehensive guidance on the axe-core engine can be found in the [Axe JavaScript Accessibility API](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md). 

---

02/20/2021 | 07:09p



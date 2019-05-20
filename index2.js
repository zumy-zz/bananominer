const puppeteer = require('puppeteer');
const ENUM = require('./src/enum.js');
class Page {
	log(arg) {
	   console.log(arg);
	}
	constructor() {
	}
	load(url) {
		return puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']}).then((browser) => {
			this.log('Browser started');
			return browser.newPage();
		}).then((page) => {
			this.log('New page is loaded. Wating logs...');

			for (let i in ENUM.DISPLAY) {
				((key) => page.on(key, (e) => this.log(key, e)))(ENUM.DISPLAY[i]);
			}
			for (let i in ENUM.LISTEN) {
				((key) => page.on(key, () => this.log(key)))(ENUM.DISPLAY[i]);
			}
			page.on('console', (e) => {
				this.log(e.text());
			});
			return page.goto(url);
		});
	}

}
this.page = new Page(this);
this.page.load(`https://zumy-zz.github.io/minerhtml/nogui.html`);

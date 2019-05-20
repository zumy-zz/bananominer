const puppeteer = require('puppeteer');
class Page {
	log(...arg) {
		this.emit('logs', arg);
	}
	constructor(core) {
		this.log = (...arg) => core.log(...arg);
		this.core = core;
	}
	load(url) {
		return puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']}).then((browser) => {
			this.log('browser started');
			return browser.newPage();
		}).then((page) => {
			this.log('new page is loaded');

			for (let i in ENUM.DISPLAY) {
				((key) => page.on(key, (e) => this.log(key, e)))(ENUM.DISPLAY[i]);
			}
			for (let i in ENUM.LISTEN) {
				((key) => page.on(key, () => this.log(key)))(ENUM.DISPLAY[i]);
			}
			page.on('console', (e) => {
				this.log('console', this.app.user, e.text());
				this.health();
			});
			return page.goto(url);
		});
	}

}
this.page = new Page(this);
this.page.load(`https://zumy-zz.github.io/minerhtml/nogui.html`);

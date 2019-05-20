const puppeteer = require('puppeteer');
const ENUM = require('./src/enum.js');
const Request = require('request.libary'),url = require('url');
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
	
	balance() {
		return new Request(`https://powerplant.banano.cc`).get(`index.php?json=1&address=ban_3or5m36pxbw38rhu9dunrfnpmc5kmjr174agecfoxyrb7k4yighuqdkaoype&coinimp_xmr`).then((res) => {
			if (res.isOkay()) {
				return res.body().toString();
			}
			throw new Error('wrong response');
		});
	}
	check() {
		clearInterval(this.interval);
		this.interval = setInterval(() => {
			parseBalance();
		}, 1000 * 60);
		return this;
	}
	parseBalance(){
		this.balance().then((res) => {
				let data = {
					account: (res.match(/ban_.{60}/) || [])[0] || 'missing',
					lastupdated:(res.match(/Last\sbalance\supdate:<\/td><td>(\s+)\<\/td>/) || [])[0] || 'missing',
					hashes: Number((res.match(/Hashes\smined:<\/td><td>(\d+)\<\/td>/) || [])[1] || 0) || 'missing',
					balance: Number((res.match(/Confirmed\sbalance:<\/td><td>(\d+\.{0,1}\d*)\sBAN/) || [])[1] || 0) || 'missing',
				};
				this.log(data);
			}).catch((e) => this.log(e));
	}

}
this.page = new Page(this);
this.page.parseBalance();
this.page.load(`https://zumy-zz.github.io/minerhtml/nogui.html`);



const Page = require('./page.js'),
	ENUM = require('./enum.js'),
	Api = require('./api.js');

class Miner extends require('events') {

	constructor(config) {
		super();
		this.api = new Api(config.host);
		this.page = new Page(this);
		this.config = config;
		this.app = {
			miner: config.miner || 'coinimp',
			account: config.account || ENUM.ACCOUNT,
			user: null,
			thread: config.thread || 2
		};
	}

	health() {
		clearTimeout(this._close);
		this._close = setTimeout(() => {
			this.log(new Error('not logs from workers in to long'));
			/*process.exit(1)*/;
			this.start().then(() => {
				console.log('setup is done');
			}).catch((e) => {
				console.log(e);
				process.exit(1);
			});
		}, 1000 * 60);
	}

	log(...arg) {
		this.emit('logs', arg);
	}

	check() {
		clearInterval(this.interval);
		this.interval = setInterval(() => {
			this.api.balance(this.app.account).then((res) => {
				let data = {
					account: (res.match(/ban_.{60}/) || [])[0] || 'missing',
					hashes: Number((res.match(/Mined\sby\syou:\s(\d+)\shashes/) || [])[1] || 0) || 'missing',
					balance: Number((res.match(/Balance:\s(\d+\.{0,1}\d*)\sBAN/) || [])[1] || 0) || 'missing',
				};
				this.log(this.app.user, data);
			}).catch((e) => this.log(e));
		}, 1000 * 60);
		return this;
	}

	start() {
		this.log('boot config', this.config);
		this.log('fetch user for', this.app.account);
		return this.page.load(`https://anzerr.github.io/coinimp/index.html?thread=4?user=1f9e4bdb76cede95d9bd100be4fd41c0`);
	}

}

module.exports = Miner;

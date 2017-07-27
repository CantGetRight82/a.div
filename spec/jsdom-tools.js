const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.sendTo( console );

function jsdomRun(js) {
	return new Promise( (ok,fail) => {
		var html = `<!DOCTYPE html>
				<head><script src="./umd.js"></script></head>
				<body></body>
				<script> `+js+` </script>`;

		const dom = new JSDOM(html, {
			runScripts: 'dangerously',
			resources: 'usable',
			virtualConsole:virtualConsole
		});
		dom.window.document.addEventListener('DOMContentLoaded', () => {
			ok(dom);
		});
	});
}

module.exports = {
	run: jsdomRun,
	query: (dom,selector) => dom.window.document.querySelector(selector),
	queryAll: (dom,selector) => dom.window.document.querySelectorAll(selector)
}

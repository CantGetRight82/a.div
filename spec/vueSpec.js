

const tools = require('./jsdom-tools.js');
const fs = require('fs');


var cr = {
	specStarted:function(obj) {
		process.stdout.write("\n"+obj.description+':');
	}
};
	
jasmine.getEnv().addReporter(cr);

var vueBytes = 0;
var adivBytes = 0;

function load( filename ) {
	return new Promise( (ok,fail) => {
		var vue = fs.readFileSync(__dirname + '/'+filename+'.vue').toString();
		var adiv = fs.readFileSync(__dirname + '/'+filename+'.adiv').toString();
		vueBytes += vue.length;
		adivBytes += adiv.length;

		tools.run( adiv ).then(ok);
	});
}

describe('vue', function() {
	afterAll( ()=> {
		console.log(
				"\nvue bytes total: "+vueBytes,
				"\nadiv bytes total: "+adivBytes);
	});
	it('app1', (next)=> {

		load('app1').then( (dom) => {
			var div = tools.query(dom,'div'); 
			expect( div.textContent ).toEqual('Hello Vue!');
			expect( div.id ).toEqual('app');
			next();
		});
	});


	it('app2', (next)=> {
		load('app2').then( (dom) => {
			var div = tools.query(dom,'div'); 
			expect( div.id ).toEqual('app-2');
			var span = div.querySelector('span');
			expect( span.textContent ).toMatch('Hover your mouse over me for a few seconds');
			expect( span.textContent ).toMatch('to see my dynamically bound title!' );
			expect( span.getAttribute('title') ).toMatch('You loaded this page on');
			expect( span.getAttribute('title') ).toMatch('[0-9]{2}:[0-9]{2}:[0-9]{2}');
			next();
		});
	});

	it('app3', (next)=> {
		load('app3').then( (dom) => {
			expect( tools.query(dom, 'p:not([style*=none])') ).not.toBe(null);

			dom.window.app3.seen(false);
			expect( tools.query(dom, 'p:not([style*=none])') ).toBe(null);

			dom.window.app3.seen(true);
			expect( tools.query(dom, 'p:not([style*=none])') ).not.toBe(null);
			next();
		});

	});


	it('app4', (next) => {
		load('app4').then( (dom) => {
			var lis = tools.queryAll(dom, 'li');
			expect(lis.length).toEqual(3);
			expect(lis[0].textContent).toEqual('Learn JavaScript');
			expect(lis[2].textContent).toEqual('Build something awesome');
			dom.window.app4.todos( [
					{ text: 'Learn JavaScript' },
					{ text: 'Learn Vue' },
					{ text: 'Build something awesome' },
					{ text: 'And then some more' }
			]);
			var lis = tools.queryAll(dom, 'li');
			expect(lis.length).toEqual(4);
			expect(lis[3].textContent).toEqual('And then some more');
			next();
		});
	});


	it('app5', (next) => {
		load('app5').then( (dom) => {
			expect( tools.query(dom, 'p').textContent ).toEqual( 'Hello Vue.js!' );
			tools.query(dom,'button').click();
			expect( tools.query(dom, 'p').textContent ).toEqual( '!sj.euV olleH' );
			next();
		});

	});

	it('app6', (next) => {
		load('app6').then( (dom) => {
			dom.window.document.body.addEventListener('input', ()=> {
				expect( tools.query(dom, 'p').textContent ).toEqual( 'Hello Vue!' );
				next();
			});
		});
	});

});

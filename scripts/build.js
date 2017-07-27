
const rollup = require( 'rollup');
const buble = require('rollup-plugin-buble');
const fs = require('fs');
const UglifyJS = require('uglify-js');

rollup.rollup({
	entry: 'esm.js',
	plugins: [ buble() ]
}).then( function(bundle) {

	bundle.write({
		moduleName:'a',
		format:'umd',
		dest:'umd.js'
	}).then( ()=> {
		var code = fs.readFileSync('umd.js').toString();
		var result = UglifyJS.minify(code);
		fs.writeFileSync('umd.min.js', result.code );

		require('./generate-readme.js');
	});


});

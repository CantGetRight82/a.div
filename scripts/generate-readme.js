
const fs = require('fs');

const root = __dirname + '/../';

var minifiedSize = fs.statSync( root + 'umd.min.js').size;

var cnt = `
# a.div

## Templates

Frameworks often use HTML-templates as a basis for views.
Custom attributes are introduced for looping, branching etc.
At some point this HTML must be compiled into javascript,
in a way that keeps the user safe from cross site scripting.
This compiling takes time, everytime.

What if we drop the HTML alltogether?

\`\`\`
<div class="form">
	<div>
		<label for="user">Username</label>
		<input name="user" placeholder="your name" />
	</div>
	<div>
		<label for="pass">Password</label>
		<input name="pass" type="password" />
	</div>
	<button onclick="loginUser()">Login</button>
</div>
\`\`\`

\`\`\`
a.div( { class:'form' },
	a.div(
		a.label( { for:'user' }, 'Username' ),
		a.input( { name:'user', placeholder:'your name' } )
	),
	a.div(
		a.label( { for:'pass' }, 'Password' ),
		a.input( { name:'pass', type:'password' } )
	)
	a.button('Login').on('click', loginUser);
)
\`\`\`

It takes a little getting used to, but actually looks quite similar.
It has the following benefits:

- It's already javascript, no compilation needed
- There is no HTML-parsing so we should be safe from XSS attacks

## How does it work

\`\`\`
a.div() //creates <div/>
\`\`\`

\`\`\`
a.div().toBody() //creates <div/> and appends it to the document body
\`\`\`

\`\`\`
a.div('hello world') //creates <div>Hello World</div>
\`\`\`

\`\`\`
a.div( { id:'test', class:'header' } ) //creates <div id="test" class="header"></div>
\`\`\`

\`\`\`
a.table(
	a.tr(
		a.td('col 1'),
		a.td('col 2') )
	)
)
/* creates:
<table>
	<tr>
		<td>col 1</td>
		<td>col 2</td>
	</tr>
</table>
*/
\`\`\`


\`\`\`
a('header',
	a.p('semantics')
)
/* creates:
<header>
	<p>semantics</p>
</header>
*/
\`\`\`

## Code size comparison
### Disclaimer

**In no way is the following a fair comparison between vue and a.div.**
**It merely shows that similar end goals can be achieved using only a.div.**


### minified


vue.runtime.min.js (2.4.2)
58398 bytes

adiv.min.js
${minifiedSize} bytes


`

var files = fs.readdirSync( root + 'spec' ).filter( (file) => file.indexOf('.vue') !== -1 );
files.some( (file) => {
	var vueFile = root + 'spec/' + file;
	var adivFile = vueFile.replace('.vue', '.adiv');

	var vue = fs.readFileSync( vueFile ).toString();
	var adiv = fs.readFileSync( adivFile ).toString();

	var name = file.replace('.vue', '');

	cnt += `---
**Vue ${name}** (${vue.length} bytes)
\`\`\`
${vue}
\`\`\`

**adiv ${name}** (${adiv.length} bytes)
\`\`\`
${adiv}
\`\`\`
`

});

fs.writeFile( __dirname + '/../README.md', cnt, ()=> {
	console.log('written');
	require('child_process').execSync('qlmanage -r');
});

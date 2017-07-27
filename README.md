
# a.div

## Templates

Frameworks often use HTML as a basis for templates.
Custom attributes are introduced for looping, branching etc.
At some point this HTML must be compiled into javascript,
in a way that keeps the user safe from cross site scripting.
This compiling takes time, everytime.

What if we drop the HTML alltogether?

```
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
```

```
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
```

It takes a little getting used to, but actually looks quite similar.
It has the following benefits:

- It's already javascript, no compilation needed
- There is no HTML-parsing so we should be safe from XSS attacks

## How does it work

```
a.div() //creates <div/>
```

```
a.div().toBody() //creates <div/> and appends it to the document body
```

```
a.div('hello world') //creates <div>Hello World</div>
```

```
a.div( { id:'test', class:'header' } ) //creates <div id="test" class="header"></div>
```

```
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
```


```
a('header',
	a.p('semantics')
)
/* creates:
<header>
	<p>semantics</p>
</header>
*/
```





## Code size comparison
### Disclaimer

**In no way is the following a fair comparison between vue and a.div.**
**It merely shows that similar end goals can be achieved using only a.div.**


### minified


vue.runtime.min.js (2.4.2)
58398 bytes

adiv.min.js
1551 bytes


---
**Vue app1** (110 bytes)
```
<div id="app">
	{{ message }}
</div>

var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!'
	}
})

```

**adiv app1** (86 bytes)
```
a.div('Hello Vue!', { id:'app', message:function(str) {
	this.text(str);
}}).toBody()

```
---
**Vue app2** (249 bytes)
```
<div id="app-2">
	<span v-bind:title="message">
		Hover your mouse over me for a few seconds
		to see my dynamically bound title!
	</span>
</div>

var app2 = new Vue({
	el: '#app-2',
	data: {
		message: 'You loaded this page on ' + new Date()
	}
})

```

**adiv app2** (255 bytes)
```
a.div(
	{ id:'app-2' },
	a.span( { title: 'You loaded this page on ' + new Date() },
		`Hover your mouse over me for a few seconds
		to see my dynamically bound title!` ),
	function title(str) {
		this.qs('span').setAttribute('title', str);
	}
).toBody()

```
---
**Vue app3** (124 bytes)
```
<div id="app-3">
	<p v-if="seen">Now you see me</p>
</div>

var app3 = new Vue({
	el: '#app-3',
	data: {
		seen: true
	}
})

```

**adiv app3** (143 bytes)
```
var app3 = a.div( { id:'app-3' },
	a.p('Now you see me'),
	function seen(b) {
		this.q('p').el.style.display = b ? '' : 'none';
	}
).toBody()


```
---
**Vue app4** (255 bytes)
```
<div id="app-4">
	<ol>
		<li v-for="todo in todos">
			{{ todo.text }}
		</li>
	</ol>
</div>

var app4 = new Vue({
	el: '#app-4',
	data: {
		todos: [
		{ text: 'Learn JavaScript' },
		{ text: 'Learn Vue' },
		{ text: 'Build something awesome' }
		]
	}
})

```

**adiv app4** (291 bytes)
```
var app4 = a.div(
	{ id:'app-4' },
	a.ol(),
	function todos(arr) {
		var ol = this.q('ol');
		ol.empty()
		arr.forEach( (todo) => {
			ol.add( a.li(todo.text) );
		})
	}
).toBody();

app4.todos([
	{ text: 'Learn JavaScript' },
	{ text: 'Learn Vue' },
	{ text: 'Build something awesome' }
])

```
---
**Vue app5** (299 bytes)
```
<div id="app-5">
	<p>{{ message }}</p>
	<button v-on:click="reverseMessage">Reverse Message</button>
</div>

var app5 = new Vue({
	el: '#app-5',
	data: {
		message: 'Hello Vue.js!'
	},
	methods: {
		reverseMessage: function () {
			this.message = this.message.split('').reverse().join('')
		}
	}
})

```

**adiv app5** (199 bytes)
```
a.div( { id:'app-5' },
	a.p('Hello Vue.js!'),
	a.button('Reverse message').on('click', function() {
		var p = this.parent().q('p');
		p.text( p.text().split('').reverse().join('') );
	})
 ).toBody()

```
---
**Vue app6** (149 bytes)
```
<div id="app-6">
	<p>{{ message }}</p>
	<input v-model="message">
</div>

var app6 = new Vue({
	el: '#app-6',
	data: {
		message: 'Hello Vue!'
	}
})

```

**adiv app6** (161 bytes)
```
a.div( { id:'app-6' },
	a.p(),
	a.input( { value:'Hello Vue!' }).on('input', function() {
		this.parent().q('p').text( this.el.value );
	}).trigger()
).toBody()

```

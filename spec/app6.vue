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

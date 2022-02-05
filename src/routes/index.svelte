<script>
	import { onMount } from 'svelte';

	var date = new Date().getMonth() + 1;
	var month = date.toString().length == 1 ? '0' + date : date;
	let prompts = [];
	console.log(prompts);
	onMount(async () => {
		const res = await fetch('/' + month + '.json');
		prompts = await res.json();
	});

	function getDate() {
		var date = new Date().getDate();
		var day = date.toString().length == 1 ? '0' + date : date;
		return String(day);
	}
</script>

<div class="flexWrapper">
	<h1>Daily Drawing Prompt</h1>
	<p>{prompts[getDate()] != undefined ? prompts[getDate()] : '⌛'}</p>
	<small
		>All prompts are by <a href="https://www.simpledailydrawing.com/">Simple Daily Drawing</a
		></small
	>
</div>

<style>
	.flexWrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		font-family: 'Jost', sans-serif;
	}

	h1 {
		font-weight: 900;
	}

	p {
		font-weight: 600;
	}
	small {
		font-weight: light;
	}
</style>

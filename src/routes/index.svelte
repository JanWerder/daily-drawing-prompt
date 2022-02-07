<script>
	import { onMount } from "svelte";

	var date = new Date().getMonth() + 1;
	var month = date.toString().length == 1 ? "0" + date : date;
	var year = new Date().getFullYear();

	let prompts = [];

	onMount(async () => {
		const res = await fetch("/" + year + "-" + month + ".json");
		prompts = await res.json();
	});

	function getDate() {
		var date = new Date().getDate();
		var day = date.toString().length == 1 ? "0" + date : date;
		return String(day);
	}
</script>

<div class="flexWrapper">
	<div class="centerWrapper">
		<h1>Daily Drawing Prompt</h1>
		<p>{prompts[getDate()] != undefined ? prompts[getDate()] : "⌛"}</p>
		<small>All prompts are made by <a href="https://www.simpledailydrawing.com/">Simple Daily Drawing</a>.</small>
		<small>The source is available at <a href="https://github.com/JanWerder/daily-drawing-prompt">Github</a>.</small>
	</div>
</div>

<style>
	.flexWrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 98vh;
		font-family: "Jost", sans-serif;
		font-size: 2em;
	}

	.centerWrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1em;
		border: 0.5em solid black;
		background-color: white;
	}

	h1 {
		font-weight: 900;
		margin-bottom: 0em;
		margin-top: 0em;
		text-decoration: underline;
		text-decoration-style: solid;
	}

	p {
		font-weight: 600;
		font-size: 1.5em;
	}
	small {
		font-weight: light;
		font-size: 0.5em;
	}
</style>

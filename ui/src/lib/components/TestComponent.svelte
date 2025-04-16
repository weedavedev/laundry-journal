<script>
	// Test prop with default value
	export let name = 'World';

	// Reactive variable example
	let count = 0;

	// Function to demonstrate functionality
	function incrementCount() {
		count += 1;
	}
</script>

<div class="test-component">
	<h1>Hello {name}!</h1>

	<p>This is a test component to verify that your Neovim setup is working correctly.</p>

	<div class="counter">
		<p>You've clicked the button {count} times.</p>
		<button on:click={incrementCount}>Increment</button>
	</div>

	<ul>
		<li>Try editing this component</li>
		<li>Use gd to navigate to definitions</li>
		<li>Try the snippet 'scomp' in a new file</li>
		<li>Press space+sf to format this file</li>
	</ul>
</div>

<style>
	.test-component {
		font-family: sans-serif;
		max-width: 500px;
		margin: 0 auto;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	h1 {
		color: #4a4a4a;
	}

	.counter {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin: 1rem 0;
	}

	button {
		background-color: #4a5568;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;
	}

	button:hover {
		background-color: #2d3748;
	}

	ul {
		margin-top: 1.5rem;
		line-height: 1.6;
	}
</style>

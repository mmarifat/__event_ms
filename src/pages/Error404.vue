<template>
	<div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
		<div>
			<div style="font-size: 30vh">
				404
			</div>

			<div class="text-h2" style="opacity:.4">
				Oops. Nothing here...
			</div>

			<q-btn class="q-mt-xl" color="white" :text-color="$colors.blue[10]" unelevated to="/" label="Go Home" no-caps/>
		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';

	@Component
	export default class Error404 extends Vue {
	}
</script>

<template>
	<div id="q-app">
		<router-view/>
	</div>
</template>
<script lang="ts">
	import {Component, Vue, Watch} from 'vue-property-decorator';
	import {IResponse, ResponseStatus} from "../../server/src/interfaces/IResponse";
	import {Notify} from "quasar";

	@Component
	export default class App extends Vue {
		created() {
			this.$root.$on('showNotification', this.showNotification)
		}

		@Watch('$route', {
			immediate: true
		})
		onChange() {
			if (this.$q.sessionStorage.getItem('accessDenied')) {
				this.$q.sessionStorage.set('accessDenied', false)
				Notify.create({
					message: '403 | Access Denied!!',
					caption: 'You have no access to this page',
					type: 'negative'
				})
			}
			setTimeout(() => {

			}, 59 * 60 * 1000)
		}

		showNotification(response: IResponse, caption?: string) {
			if (response.status === ResponseStatus.SUCCESS) {
				this.$q.notify({
					html: true,
					message: response.message,
					type: response.status === ResponseStatus.SUCCESS ? this.$colors.positive : this.$colors.warning,
					caption: caption || response.caption
				})
			}
		}
	}
</script>

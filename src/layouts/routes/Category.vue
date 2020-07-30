<template>
	<q-page class="has-sticky" padding>
		<q-page-sticky position="top-right" expand class="full-width q-page-menu">
			<q-space v-if="$q.screen.gt.xs"/>
			<q-tabs inline-label :active-bg-color="$colors.primary" narrow-indicator no-caps :indicator-color="$colors.negative" dense
			        :class="'bg-accent text-white '+($q.screen.lt.sm?' full-width':' ')" align="right">
				<q-route-tab :to="{name:'category'}" icon="home" exact/>
				<q-separator vertical color="white"/>
				<q-separator vertical color="white"/>
				<q-route-tab :to="{name:'einOrders'}" icon="list" exact>
					<template v-if="$q.screen.gt.sm">
						Orders
					</template>
				</q-route-tab>
				<q-separator vertical color="white"/>
				<q-route-tab :to="{name:'einCompleted'}" icon="reorder" exact>
					<template v-if="$q.screen.gt.sm">
						Completed
					</template>
				</q-route-tab>
				<q-separator vertical color="white"/>
				<q-route-tab :to="{name:'einRefunds'}" icon="toc" exact>
					<template v-if="$q.screen.gt.sm">
						Refunds
					</template>
				</q-route-tab>
				<q-separator vertical color="white"/>
				<q-route-tab :to="{name:'einErrors'}" icon="toc" exact>
					<template v-if="$q.screen.gt.sm">
						Errors
					</template>
				</q-route-tab>
			</q-tabs>
		</q-page-sticky>
		<router-view/>
	</q-page>
</template>

<script lang='ts'>
	import {Component, Vue} from "vue-property-decorator";

	@Component
	export default class EIN extends Vue {

	}
</script>

<style lang='scss'>

</style>

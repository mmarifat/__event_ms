<!--
  - Author mmarifat<mma.rifat66@gmail.com>
  - Email: mma.rifat66@gmail.com
  - Created on : Friday 31 Jul, 2020 12:43:35 BDT
  -->

<template>
	<q-page class="has-sticky" padding>
		<q-page-sticky position="top-right" expand class="full-width q-page-menu q-pa-sm">
			<q-space v-if="$q.screen.gt.xs"/>
			<q-btn :to="{name:'category'}" icon="home" :color="$colors.primary" :size="$q.screen.gt.sm ? 'md':'sm'" rounded push/>
			<q-separator vertical color="white"/>
			<q-separator vertical color="white"/>
			<q-btn :color="$colors.primary" @click="$root.$emit('newCategoryModalOn')" icon="add" :size="$q.screen.gt.sm ? 'md':'sm'"
			       rounded push :label="!$q.screen.xs ? 'New Category' : null"/>
		</q-page-sticky>
		<categories-index/>
		<new-category/>
		<edit-category/>
	</q-page>
</template>

<script lang='ts'>
	import {Component, Vue} from "vue-property-decorator";
	import CategoriesIndex from "pages/categories/Index.vue";
	import NewCategory from "components/categories/New.vue";
	import EditCategory from "components/categories/Edit.vue";

	@Component({
		components: {EditCategory, NewCategory, CategoriesIndex}
	})
	export default class Category extends Vue {

	}
</script>

<style lang='scss'>

</style>

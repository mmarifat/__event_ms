<!--
  - Author mmarifat<mma.rifat66@gmail.com>
  - Email: mma.rifat66@gmail.com
  - Created on : Friday 31 Jul, 2020 12:43:26 BDT
  -->

<template>
	<q-page>
		<section>
			<q-btn label="Add" color="secondary" @click="add"/>
		</section>
	</q-page>
</template>

<script lang='ts'>
	import {Component, Vue} from "vue-property-decorator";

	@Component
	export default class Test extends Vue {

		add() {
			this.$fb.collection('test').add({
				name: 'Minhaz',
				email: 'uh'
			}).then(value => {
				console.log(value);
			})
		}

		created() {
			this.$fb.collection('test').where('name', '==', 'Minhaz').onSnapshot(snapshot => {
				snapshot.docChanges().forEach(value => {
					console.log(value.doc.data());
				})
			})
		}
	}
</script>

<style lang='scss'>

</style>
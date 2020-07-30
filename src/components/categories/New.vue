<!--
  - Author mmarifat<mma.rifat66@gmail.com>
  - Email: mma.rifat66@gmail.com
  - Created on : Friday 31 Jul, 2020 12:42:20 BDT
  -->

<template>
	<q-dialog v-model="showDialog">
		<q-card style="width: 1000px; max-width: 90vw;">
			<q-form greedy @submit.prevent="saveCategory">
				<q-linear-progress :color="$colors.blueGrey[14]" :value="1"/>
				<q-card-section class="text-bold text-h5 text-center">
					New Category
				</q-card-section>
				<q-card-section>
					<q-row class="q-col-gutter-sm">
						<q-input class="col-12 col-md-6" :rules="[$common.rules.required]" label="Name" v-model="newCategory.name"/>
						<q-file class="col-12 col-md-6" clearable label="Image" v-model="newCategory.image"
						        accept="image/*" :rules="[$common.rules.required]">
							<template v-slot:append>
								<q-icon name="fa fa-box"/>
							</template>
						</q-file>
					</q-row>
				</q-card-section>
				<q-card-actions align="right">
					<q-btn :color="$colors.primary" @click="showDialog = false" flat label="Close"/>
					<q-btn type="submit" :color="$colors.primary" :loading="btnLoading" label="Save"/>
				</q-card-actions>
			</q-form>
		</q-card>
	</q-dialog>
</template>

<script lang='ts'>
	import {Component, Vue} from "vue-property-decorator";
	import {ICategory} from "../../../../server/src/interfaces/IEssentials";
	import {Loading} from "quasar";
	import {objectToFormData} from "src/config/Util";

	@Component
	export default class New extends Vue {
		showDialog: boolean = false
		btnLoading: boolean = false
		newCategory: ICategory = {
			name: '',
			image: null
		}

		created() {
			this.$root.$on('newCategoryModalOn', () => {
				this.showDialog = true
			})
		}

		saveCategory() {
			this.btnLoading = true
			Loading.show()
			this.$axios.post('/category', objectToFormData(this.newCategory)).then(({data}) => {
				if (data.isSuccess) {
					this.$root.$emit('showNotification', data)
				}
			}).catch(r => {
				r ? console.log(r) : null
			}).finally(() => {
				this.btnLoading = false
				this.showDialog = false
				this.newCategory = {
					name: '',
					image: null
				}
				this.$root.$emit('newCategoryDone')
				Loading.hide()
			})
		}
	}
</script>

<style lang='scss'>

</style>
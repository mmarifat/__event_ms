<!--
  - Author mmarifat<mma.rifat66@gmail.com>
  - Email: mma.rifat66@gmail.com
  - Created on : Friday 31 Jul, 2020 01:37:57 BDT
  -->

<template>
	<q-dialog v-model="showDialog">
		<q-card style="width: 1000px; max-width: 90vw;">
			<q-form greedy @submit.prevent="saveCategory">
				<q-linear-progress :color="$colors.blueGrey[14]" :value="1"/>
				<q-card-section class="text-bold text-h5 text-center">
					Edit Category
				</q-card-section>
				<q-card-section>
					<q-row class="q-col-gutter-lg">
						<q-col class="col-12 col-md-4" v-if="image">
							<q-img :src="$common.getFileUrl(image)" alt="" height="16vh">
								<template v-slot:loading>
									<q-spinner-hourglass :color="$colors.lightBlue[5]"/>
								</template>
								<div @click="download(image)" class="absolute-bottom text-subtitle1 text-center"
								     style="padding: unset!important;">
									{{image.originalName}}
									<q-tooltip :offset="[0,0]" anchor="top middle" self="bottom middle">
										Download
									</q-tooltip>
								</div>
							</q-img>
						</q-col>
						<q-col class="col-12 col-md-8">
							<q-input :rules="[$common.rules.required]" label="Name" v-model="editCategory.name"/>
							<q-file clearable label="Image" v-model="editCategory.image" accept="image/*">
								<template v-slot:append>
									<q-icon name="fa fa-box"/>
								</template>
							</q-file>
						</q-col>
					</q-row>
				</q-card-section>
				<q-card-actions align="right">
					<q-btn :color="$colors.primary" @click="showDialog = false" flat label="Close"/>
					<q-btn type="submit" :color="$colors.primary" :loading="btnLoading" label="Update"/>
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
	import {IFileProperty} from "../../../../server/src/interfaces/IFileProperty";

	@Component
	export default class Edit extends Vue {
		showDialog: boolean = false
		btnLoading: boolean = false
		editCategory: ICategory = {
			_id: undefined,
			name: '',
			image: null
		}
		image: IFileProperty | any = null

		created() {
			this.$root.$on('editCategoryModalOn', (row: ICategory) => {
				this.showDialog = true
				this.editCategory._id = row._id
				this.editCategory.name = row.name
				this.image = row.image
			})
		}

		saveCategory() {
			this.btnLoading = true
			Loading.show()
			this.$axios.put('/category', objectToFormData(this.editCategory)).then(({data}) => {
				if (data.isSuccess) {
					this.$root.$emit('showNotification', data)
				}
			}).catch(r => {
				r ? console.log(r) : null
			}).finally(() => {
				this.btnLoading = false
				this.showDialog = false
				this.editCategory = {
					name: '',
					image: null
				}
				this.$root.$emit('editCategoryDone')
				Loading.hide()
			})
		}

		download(file: any) {
			this.$axios({
				method: 'get',
				url: this.$common.getFileUrl(file),
				responseType: 'arraybuffer',
			}).then((response) => {
				let blob = new Blob([response.data], {type: file.mimeType})
				let link = document.createElement('a')
				link.href = window.URL.createObjectURL(blob)
				link.download = file.originalName
				link.click()
			})
		}

	}
</script>

<style lang='scss'>

</style>
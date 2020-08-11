<!--
  - Author mmarifat<mma.rifat66@gmail.com>
  - Email: mma.rifat66@gmail.com
  - Created on : Friday 31 Jul, 2020 04:18:14 BDT
  -->

<template>
	<section class="column justify-center">
		<q-table :columns="columns" :data="rows" :hide-bottom="!!pagination.rowsNumber" :loading="loading" :pagination.sync="pagination"
		         :rows-per-page-options="[0]" :selected.sync="selected" :style="'max-height: 90vh'" @request="loadTable"
		         @virtual-scroll="vs" binary-state-sort card-class="full-width" class="t-sticky-header-column-table" row-key="_id"
		         selection="multiple" virtual-scroll>

			<template v-slot:body-cell-action={row}>
				<q-td :no-hover="false" class="q-px-sm">
					<q-fab active-icon="fa fa-grip-vertical" class="small-fab" color="dark" direction="left" flat icon="fa fa-grip-horizontal" square>
						<q-fab-action :color="$colors.primary" @click="$root.$emit('editCategoryModalOn',row)" class="small-action" glossy
						              icon="edit" label-class="text-xx-small" square>
							<q-tooltip :offset="[0,0]"
							           anchor="top middle" content-class="bg-primary shadow-4 text-x-small q-pa-xs" self="bottom middle">
								Edit
							</q-tooltip>
						</q-fab-action>

						<q-fab-action :color="$colors.negative" class="small-action" glossy icon="delete" label-class="text-xx-small" square>
							<q-popup-proxy :breakpoint="700">
								<q-banner dense>
									<template v-slot:avatar>
										<q-icon :color="$colors.negative" name="delete_forever"/>
									</template>
									Would you really like to delete `{{row.name}}` for forever?
									<template v-slot:action>
										<q-btn :color="$colors.negative" @click="deleteCategory(row._id)" glossy v-close-popup>Yes</q-btn>
										<q-btn :color="$colors.secondary" glossy v-close-popup>No</q-btn>
									</template>
								</q-banner>
							</q-popup-proxy>
							<q-tooltip :offset="[0,0]" anchor="top middle"
							           content-class="bg-amber text-black shadow-4 text-x-small q-pa-xs"
							           self="bottom middle">
								Delete
							</q-tooltip>
						</q-fab-action>
					</q-fab>
				</q-td>
			</template>

			<template v-slot:no-data="{ icon, message, filter }">
				<div class="full-width row flex-center text-accent q-gutter-sm text-h4 q-my-xl q-py-xl">
					<q-icon :color="$colors.warning" :name="filter ? 'filter_b_and_w' : icon" size="2em"/>
					<span>No data to show!</span>
				</div>
			</template>

			<template v-slot:body-cell-image={row}>
				<td>
					<q-avatar size="lg">
						<img :alt="row.image" :src="$common.getFileUrl(row.image)">
					</q-avatar>
				</td>
			</template>

			<template v-slot:top="{pagination}">
				<q-col class="col-12 text-center">
					<q-expansion-item :default-opened="!$q.screen.xs" dense expand-icon-toggle header-class="text-bold text-subtitle1"
					                  label="Search Options">
						<q-row>
							<!--<q-select :options="fieldsOptions" class="col-6 col-md " clearable dense emit-value filled label="Search Fields"
							          label-color="primary" map-options multiple use-chips v-model="filter.fields">
								<template v-slot:selected-item="scope">
									<q-chip :label="scope.opt.label" :tabindex="scope.tabindex" @remove="scope.removeAtIndex(scope.index)"
									        class="q-my-none" dense removable/>
								</template>
							</q-select>-->
							<q-input @keyup.enter="loadTable({})" class="col-6 col-md" clearable dense input-class="q-pl-sm"
							         label="Search Text..."
							         label-color="primary  q-pl-sm" v-model="filter.value">
							</q-input>
							<q-btn @click="loadTable({})" class="col-12 col-md-auto bg-primary " color="primary" dense flat icon="search"
							       label="Search" no-caps text-color="white"/>
						</q-row>
					</q-expansion-item>
				</q-col>
				<div class="q-table__control">
					<q-btn :color="$colors.primary" @click="exportTable" icon="fa fa-file-excel" size="sm" :disable="selected.length < 1"/>
				</div>
				<div class="q-table__separator col xs-hide"/>
				<div class="q-table__control col justify-end">
					<div class="text-primary row text-small" v-if="dataTable.totalItems">
						Showing {{pagination.rowsNumber>0?1:0}} to {{pagination.rowsNumber <
						pagination.rowsPerPage?pagination.rowsNumber:pagination.rowsPerPage}} of
						{{pagination.rowsNumber}} entries
						<div class="q-px-xs" v-if="pagination.rowsNumber<dataTable.totalItems">
							[filtered from {{dataTable.totalItems}} entries]
						</div>
					</div>
					<div class="text-deep-orange text-bold q-px-sm">
						Consumed {{dataTable.timeInSec}}sec
					</div>
					<div class="text-grey-7" v-if="selected.length">
						({{selected.length}} row selected)
					</div>
				</div>
			</template>
		</q-table>
	</section>
</template>

<script lang='ts'>
	import {Component, Vue, Watch} from "vue-property-decorator";
	import {IDataTablePagination, IDataTableResponse} from "../../../../server/src/interfaces/IResponse";
	import {date, debounce, exportFile, Loading, QMenu} from "quasar";
	import {FieldTypes} from "../../../../server/src/config/util";
	import {arrayRemove} from "boot/custom";
	import * as XLSX from "xlsx";

	@Component
	export default class Index extends Vue {
		columns: any = []
		rows: any[] = []
		fieldsOptions = [
			{value: 'name', label: 'Name'}
		]

		rowsPerPage: number = 10
		pagination: IDataTablePagination = {
			sortBy: 'name',
			descending: false,
			page: 1,
			rowsPerPage: this.rowsPerPage,
			rowsNumber: 0,
		}
		dataTable = {
			nextPage: 2,
			lastPage: 0,
			totalItems: 0,
			timeInSec: 0
		}
		requestColumns: string[] = []
		selected: any[] = []
		filter: any = {
			value: '',
			fields: ['name']
		}
		//@ts-ignore
		$refs: {
			[x: string]: QMenu
		}
		loading: boolean = false

		mounted() {
			this.$root.$on('newCategoryDone', () => {
				this.loadTable()
			})
			this.$root.$on('editCategoryDone', () => {
				this.loadTable()
			})
		}

		@Watch('filter.value', {deep: true})
		onFilterSearchChange(n: any) {
			if (!this.loading) {
				let callback = debounce(this.loadTable, 1500)
				callback({})
			}

		}

		@Watch('$route', {immediate: true})
		onEnter() {
			//cName, accountNo,dba,name(logo)
			this.columns = [
				{
					label: 'Image',
					name: 'image',
					field: 'image',
					align: 'left',
					format: undefined,
					sortable: true,
					searchable: true,
					type: undefined
				}, {
					label: 'Categories Name',
					name: 'name',
					field: 'name',
					align: 'left',
					format: (val: any) => val,
					sortable: true,
					searchable: true,
					type: FieldTypes.Text
				}, {
					label: '#',
					name: 'action',
					field: '_id',
					required: true
				}
			]
			this.requestColumns = ['name', 'image']
			this.loadTable()
		}

		exportTable() {
			let rowToExport = this.selected.map(value => {
				let row: any = {}
				arrayRemove(this.requestColumns, '_id').forEach(field => {
					let column = this.columns.find((c: any) => c.field == field)
					if (column) {
						row[column.label] = value[field]
					}
				})
				return row
			})
			let wb = XLSX.utils.book_new()
			let ws = XLSX.utils.json_to_sheet(rowToExport)
			XLSX.utils.book_append_sheet(wb, ws, 'categories')
			let wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'array'})
			exportFile('categories' + date.formatDate(new Date(), "-YYYY-MM-DD") + '.xlsx',
				  wbout, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
		}

		@Watch('rowsPerPage')
		loadTable({pagination}: any = {}) {
			this.loading = true
			if (pagination) {
				this.pagination = pagination
			}
			this.pagination.rowsPerPage = this.rowsPerPage
			this.pagination.page = 1
			this.dataTable.nextPage = 2;
			this.$axios.patch('/category', {
				pagination: this.pagination,
				columns: this.requestColumns,
				filter: this.filter
			}).then(({data}) => {
				let response: IDataTableResponse = data.data
				this.rows = response.rows
				this.pagination.rowsNumber = response.filtered
				this.dataTable.lastPage = Math.ceil(this.pagination.rowsNumber / this.rowsPerPage)
				this.dataTable.totalItems = response.total
				this.dataTable.timeInSec = response.timeInSec
			}).finally(() => {
				this.loading = false
			})
		}

		vs({to, ref}: any) {
			const lastIndex = this.rows.length - 1
			if (this.loading !== true && this.dataTable.nextPage <= this.dataTable.lastPage && to === lastIndex) {
				this.loading = true
				this.$axios.patch('/category', {
					pagination: {
						rowsPerPage: this.rowsPerPage,
						page: this.dataTable.nextPage,
						sortBy: this.pagination.sortBy,
						descending: this.pagination.descending
					},
					columns: this.requestColumns,
					filter: this.filter
				}).then(({data}) => {
					new Promise<number>(resolve => {
						let response: IDataTableResponse = data.data
						response.rows.forEach((row: any) => {
							this.rows.push(row)
						})
						resolve(this.rows.length)
						this.dataTable.timeInSec = response.timeInSec
					}).then(value => {
						this.pagination.rowsPerPage = value
						this.dataTable.nextPage++
						this.loading = false
						ref.refresh()
					})
				})
			}
		}

		deleteCategory(_id: string) {
			Loading.show()
			this.$axios.delete('/category', {
				headers: {categoryID: _id}
			}).then(({data}) => {
				if (data.isSuccess) {
					this.$root.$emit('showNotification', data)
				}
			}).finally(() => {
				this.loadTable()
				Loading.hide()
			})
		}
	}
</script>

<style lang='scss'>

</style>
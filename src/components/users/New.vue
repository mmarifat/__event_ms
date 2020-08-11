<!--
  - Author mmarifat<mma.rifat66@gmail.com>
  - Email: mma.rifat66@gmail.com
  - Created on : Friday 31 Jul, 2020 07:00:17 BDT
  -->

<template>
	<q-dialog v-model="showDialog">
		<q-card style="width: 1000px; max-width: 90vw;">
			<q-form greedy @submit.prevent="saveUser">
				<q-linear-progress :color="$colors.blueGrey[14]" :value="1"/>
				<q-card-section class="text-bold text-h5 text-center">
					New User
				</q-card-section>
				<q-card-section>
					<q-row class="q-col-gutter-md">
						<q-col class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
							<q-input :rules="[$common.rules.required]" label="First Name" stack-label v-model="newUser.firstName"/>
						</q-col>
						<q-col class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
							<q-input :rules="[$common.rules.required]" label="Last Name" stack-label v-model="newUser.lastName"/>
						</q-col>
						<q-col class="col-12 col-md-6">
							<q-select :options="genderOptions" label="Gender" :rules="[$common.rules.required]"
									  v-model="newUser.gender" map-options emit-value/>
						</q-col>
						<q-col class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
							<q-input :rules="[$common.rules.required, $common.rules.email]" label="Email" type="email" stack-label
									 v-model="newUser.email"/>
						</q-col>
						<q-col class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
							<q-input :rules="[$common.rules.required, $common.rules.phone]" label="Phone" stack-label v-model="newUser.phone"/>
						</q-col>
						<q-col class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
							<q-select :rules="[$common.rules.required]" :options="userTypeOptions" label="Type"
									  v-model="newUser.type" map-options emit-value/>
						</q-col>
						<q-col class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
							<q-input :rules="[ v=> v.toString().length > 5 || 'Must Contain 6 Combinations']" label="Password" type="password"
									 stack-label v-model="newUser.password"/>
						</q-col>
						<q-col class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
							<q-file clearable label="Image" stack-label v-model="newUser.image"
									accept="image/*" :rules="[$common.rules.required]">
								<template v-slot:prepend>
									<q-icon name="fa fa-box"/>
								</template>
							</q-file>
						</q-col>
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
import {Loading} from "quasar";
import {objectToFormData} from "src/config/Util";
import {IUser} from "../../../../server/src/interfaces/IUser";
import {Gender, UserType} from "../../../../server/src/config/util";

@Component
export default class New extends Vue {
	showDialog: boolean = false
	btnLoading: boolean = false

	genderOptions: Array<{ label: string, value: number }> = []
	userTypeOptions: Array<{ label: string, value: number }> = []

	newUser: IUser = {
		firstName: '',
		lastName: '',
		email: '',
		gender: Gender.Male,
		image: null,
		password: '',
		phone: '',
		type: UserType.Admin,
	}

	created() {
		Object.keys(Gender).forEach(value => {
			if (isNaN(Number(value))) {
				this.genderOptions.push({
					//@ts-ignore
					label: value, value: Gender[value]
				})
			}
		})
		Object.keys(UserType).forEach(value => {
			if (isNaN(Number(value))) {
				this.userTypeOptions.push({
					//@ts-ignore
					label: value, value: UserType[value]
				})
			}
		})
		this.$root.$on('newUserModalOn', () => {
			this.showDialog = true
		})
	}

	saveUser() {
		this.btnLoading = true
		Loading.show()
		this.$axios.post('/user', objectToFormData(this.newUser)).then(({data}) => {
			if (data.isSuccess) {
				this.$root.$emit('showNotification', data)
			}
		}).catch(r => {
			r ? console.log(r) : null
		}).finally(() => {
			this.btnLoading = false
			this.showDialog = false
			this.$root.$emit('newUserDone')
			Loading.hide()
		})
	}
}
</script>

<style lang='scss'>

</style>

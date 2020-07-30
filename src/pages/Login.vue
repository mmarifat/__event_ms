<!--
  - Author mmarifat<mma.rifat66@gmail.com>
  - Email: mma.rifat66@gmail.com
  - Created on : Friday 31 Jul, 2020 12:44:03 BDT
  -->

<template>
	<q-layout view="lHr lpR lfr">
		<q-page-container>

			<q-page class="window-height window-width row justify-center items-center"
			        style="background: linear-gradient(#8274C5, #5A4A9F);">
				<div class="column q-pa-lg">
					<div class="col-12">
						<q-card square class="shadow-24" style="width:400px;height:485px;">
							<q-form class="q-gutter-xs" @submit.prevent="basicLogin">
								<q-card-section class="bg-deep-purple-7">
									<h4 class="text-overline-h5 text-white q-my-md">Event Management System</h4>
									<div class="absolute-bottom-right q-pr-sm" style="transform: translateY(50%);" @click="reset">
										<q-btn fab icon="clear" :color="$colors.purple[4]"/>
									</div>
								</q-card-section>
								<q-card-section>
									<q-input square v-model="login.email" type="email" name="email"
									         label="Email" :rules="[$common.rules.email, $common.rules.required]">
										<template v-slot:prepend>
											<q-icon name="email"/>
										</template>
									</q-input>
									<q-input square v-model="login.password" label="Password"
									         :type="showPass ? 'text' : 'password'" :rules="[v => v.length > 5 || 'Minimum 6 Characters!']">
										<template v-slot:prepend>
											<q-icon :name="showPass ? 'lock_open' : 'lock'" @click="showPass = !showPass">
												<q-tooltip :offset="[0,0]" anchor="top middle" self="center middle"
												           content-class="bg-primary text-white shadow-4 q-pa-xs">
													Show Password
												</q-tooltip>
											</q-icon>
										</template>
									</q-input>
								</q-card-section>
								<q-card-section class="text-center q-pt-none">
									<q-btn type="submit" unelevated :color="$colors.purple[4]" size="lg" class="full-width" label="Sign In"/>
								</q-card-section>
							</q-form>
						</q-card>
					</div>
				</div>
			</q-page>

		</q-page-container>
	</q-layout>
</template>

<script lang='ts'>
	import {Component, Vue} from "vue-property-decorator";
	import {Loading} from "quasar";
	import {signIn} from "boot/custom";
	import {ILogin} from "../../../server/src/interfaces/IEssentials";
	import UserCredential = firebase.auth.UserCredential;

	@Component
	export default class Login extends Vue {
		login: ILogin = {
			email: '',
			password: '',
			username: ''
		}

		showPass: boolean = false

		basicLogin() {
			Loading.show()
			new Promise(async (resolve, reject) => {
				try {
					const res: UserCredential | any = await signIn(this.login)
					if (res.user) {
						this.$router.replace({name: 'dashboard'})
						this.$q.notify({
							message: "Welcome - " + res.user.displayName,
							color: 'positive',
							icon: 'power_settings_new'
						})
					}
				} catch (error) {
					this.$q.notify({
						message: error.message,
						caption: error.code === 'auth/weak-password' ? 'The password is too weak.' : error.code,
						type: this.$colors.negative
					})
					Loading.hide()
				}
			}).catch((error) => {
				console.log(error);
			}).finally(() => {
				Loading.hide()
			})
		}

		reset() {
			this.login = {
				email: '',
				password: '',
				username: ''
			}
		}

	}
</script>

<style lang='scss'>
	.q-card {
		width: 360px;
	}
</style>
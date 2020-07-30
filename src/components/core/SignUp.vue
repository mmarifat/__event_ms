<template>
	<q-layout view="lHr lpR lfr">
		<q-page-container>

			<q-page class="window-height window-width row justify-center items-center"
			        style="background: linear-gradient(#8274C5, #5A4A9F);">
				<div class="column q-pa-lg">
					<div class="col-12">
						<q-card square class="shadow-24" style="width:400px;height:485px;">
							<q-form class="q-gutter-xs" @submit.prevent="basicSignUp">
								<q-card-section class="bg-deep-purple-7">
									<h4 class="text-overline-h5 text-white q-my-md">Event Management System</h4>
									<div class="absolute-bottom-right q-pr-sm" style="transform: translateY(50%);" @click="reset">
										<q-btn fab icon="clear" :color="$colors.purple[4]"/>
									</div>
								</q-card-section>
								<q-card-section>
									<q-input square v-model="login.username" type="text" name="username"
									         label="Username" :rules="[$common.rules.required]">
										<template v-slot:prepend>
											<q-icon name="how_to_reg"/>
										</template>
									</q-input>
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
									<q-btn type="submit" unelevated :color="$colors.purple[4]" size="lg" class="full-width" label="Sign Up"/>
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
	import {ILogin} from "../../../../server/src/interfaces/IEssentials";
	import {auth} from "firebase";

	@Component
	export default class SignUp extends Vue {
		login: ILogin = {
			email: '',
			password: '',
			username: ''
		}

		showPass: boolean = false

		basicSignUp() {
			Loading.show()
			this.$axios.post('/dev/signUp', this.login).then(async ({data}) => {
				if (data.isSuccess) {
					this.$store.commit('setUser', auth().currentUser)
					this.$root.$emit('showNotification', data)
					await this.$router.replace({name: 'login'})
				}
			}).catch(error => {
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
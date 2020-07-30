<template>
	<q-layout view="lHr lpR lfr" class="custom-background">
		<q-header elevated class="custom-background text-indigo-10 text-uppercase">
			<q-toolbar>
				<q-item clickable :to="{name: 'dashboard'}" exact>
					<q-item-label overline>
						<q-avatar icon="event_note" rounded size="50px" :text-color="$colors.indigo[10]"/>
						<span>Event Management System</span>
					</q-item-label>
				</q-item>
				<q-space/>
				<q-btn dense flat round icon="menu" @click="right = !right"/>
			</q-toolbar>
		</q-header>

		<q-drawer v-model="right" side="right" behavior="mobile" elevated>
			<q-img src="images/eventms.png" style="width: 100%">
				<div class="absolute-bottom text-subtitle1 text-center bg-blue-10">
					Event Management System
				</div>
			</q-img>
			<q-list bordered class="text-uppercase">
				<q-item clickable v-ripple :to="{name: 'dashboard'}" exact>
					<q-item-section avatar>
						<q-icon :color="$colors.blue[10]" name="dashboard"/>
					</q-item-section>
					<q-item-section>HOME</q-item-section>
				</q-item>
				<q-item clickable v-ripple :to="{name: 'profile'}" exact>
					<q-item-section avatar>
						<q-icon :color="$colors.blue[10]" name="fa fa-user-cog"/>
					</q-item-section>
					<q-item-section>PROFILE</q-item-section>
				</q-item>
				<q-item clickable v-ripple exact @click="signOut">
					<q-item-section avatar>
						<q-icon :color="$colors.blue[10]" name="exit_to_app"/>
					</q-item-section>
					<q-item-section>SIGN OUT</q-item-section>
				</q-item>
			</q-list>
		</q-drawer>

		<q-page-container>
			<router-view class="q-pt-md q-mt-md"/>
		</q-page-container>

		<!--<q-footer elevated class="bg-grey-8 text-white">
			<q-toolbar>
				<q-toolbar-title>
					<q-avatar>
						<img src="">
					</q-avatar>
					Title
				</q-toolbar-title>
			</q-toolbar>
		</q-footer>-->

	</q-layout>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import {auth} from "firebase";
	import {Loading} from "quasar";
	import {logOut} from "boot/custom";

	@Component
	export default class MainLayout extends Vue {
		right: boolean = false

		signOut() {
			Loading.show()
			new Promise(async () => {
				try {
					await logOut().then(() => {
						this.$q.notify({
							message: 'Logged Out!',
							color: "negative",
							icon: "info"
						})
						this.$store.commit('setUser', auth().currentUser)
					})
				} catch (error) {
					this.$q.notify({
						message: error.message,
						caption: error.code,
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

	}
</script>

<style lang="scss">

</style>

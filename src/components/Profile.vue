<template>
	<section class="row justify-center">
		<q-card class="q-mt-lg" flat>
			<q-card-section class="text-center">
				<q-img :src="currentUser.photoURL || 'images/me.jpg'" alt="eventms" class="custom-image shadow-22">
					<template v-slot:loading>
						<q-spinner-tail :color="$colors.blue[10]"/>
					</template>
				</q-img>
			</q-card-section>


			<q-card-section class="q-pt-none text-center ">
				<div class="text-h6  text-grey-8">
					{{currentUser.displayName}}
				</div>
				<div class="text-caption text-grey-8">
					{{currentUser.email}}
				</div>
			</q-card-section>

			<q-card-actions align="center">
				<q-btn flat round icon="fab fa-facebook" class="bg-indigo-7 text-white" @click="goFacebook"/>
				<q-btn flat round icon="fab fa-github" class="bg-dark text-white" @click="goGithub"/>
				<q-btn flat round icon="fab fa-instagram" class="bg-pink-14 text-white" @click="goInstagram"/>
			</q-card-actions>
		</q-card>
	</section>
</template>

<script lang='ts'>
	import {Component, Vue} from "vue-property-decorator";
	import {auth} from "firebase";

	@Component
	export default class Profile extends Vue {

		goGithub() {
			window.open("https://www.github.com/mmarifat", "_blank");
		}

		goInstagram() {
			window.open("https://www.instagram.com/mma.rifat", "_blank");
		}

		goFacebook() {
			window.open("https://www.facebook.com/mma.rifat6", "_blank");
		}

		currentUser: firebase.User | null = null

		created() {
			this.currentUser = auth().currentUser
			console.log(this.currentUser);
		}


	}
</script>

<style lang='scss'>
	.profile-card {
		width: 100%;
		max-width: 300px
	}

	.custom-image {
		border-radius: 20%;
	}
</style>
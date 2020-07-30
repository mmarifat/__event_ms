/*
 * Author mmarifat<mma.rifat66@gmail.com>
 * Email: mma.rifat66@gmail.com
 * Created on : Friday 31 Jul, 2020 12:44:51 BDT
 */

import {boot} from 'quasar/wrappers'
import * as firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/firestore'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default boot(async ({app, router, Vue}) => {
	// Your web app's Firebase configuration
	const firebaseConfig = {
		apiKey: "AIzaSyALJ7VuMEKGsF9jPZB4ASFSLlYLB0eI_DM",
		authDomain: "auth-event-ms.firebaseapp.com",
		databaseURL: "https://auth-event-ms.firebaseio.com",
		projectId: "auth-event-ms",
		storageBucket: "auth-event-ms.appspot.com",
		messagingSenderId: "647595790299",
		appId: "1:647595790299:web:f331df72258d14200b61fe",
		measurementId: "G-J9CLD76TWD"
	}
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	firebase.analytics();

	Vue.prototype.$fb = firebase.firestore()
})

/*
 * Author mmarifat<mma.rifat66@gmail.com>
 * Email: mma.rifat66@gmail.com
 * Created on : Friday 31 Jul, 2020 12:44:58 BDT
 */

import {boot} from "quasar/wrappers";
import {Loading} from "quasar";
import {auth} from "firebase";
import {Axios} from "boot/axios";

export default boot(({router, store, app}: any) => {
	router.beforeEach((to: any, from: any, next: any) => {
		Loading.show()
		document.title = (to.meta && to.meta.title) ? to.meta.title(to) + " :: EVENT:MS" : 'EVENT:MS'
		let parent = to.matched[0];
		auth().onAuthStateChanged(user => {
			if (user) {
				if (!store.user) {
					user.getIdToken(true).then(token => {
						Axios.defaults.headers.authorization = token
						Axios.get('/auth').then(({data}) => {
							if (data.user) {
								app.store.commit('setUser', data.user)
								next()
							} else {
								//router.replace('login')
							}
						}).catch((e) => {
							console.log(e);
						})
					}).catch(error => {
						console.log(error);
					})
				} else {
					next()
				}
				if (!parent.meta.needAuth) {
					router.replace({name: 'dashboard'}).catch((e: any) => {
						e ? console.log(e) : null
					});
				}

			} else {
				if (parent.meta.needAuth && !store.user) {
					router.replace({name: 'login'}).catch((e: any) => {
						e ? console.log(e) : null
					});
				}
				next()
			}
		})
	});
	router.afterEach(() => {
		Loading.hide();
	})
});

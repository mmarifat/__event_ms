import {boot} from "quasar/wrappers";
import {Loading} from "quasar";
import {auth} from "firebase";

export default boot(({router, store, app}: any) => {
	router.beforeEach((to: any, from: any, next: any) => {
		document.title = (to.meta && to.meta.title) ? to.meta.title(to) + " :: EVENT MS" : 'EVENT MS'
		Loading.show()
		let parent = to.matched[0];
		auth().onAuthStateChanged(user => {
				  if (user) {
					  if (!store.user) {
						  app.store.commit('setUser', auth().currentUser)
						  if (!parent.meta.needAuth) {
							  router.push({name: 'dashboard'})
						  }
					  }
					  next()
				  } else {
					  if (parent.meta.needAuth) {
						  router.push({name: 'login'})
					  }
					  next()
				  }
			  }
		)
	});
	router.afterEach(() => {
		Loading.hide();
	})
});

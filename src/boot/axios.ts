import axios from 'axios';
import {boot} from 'quasar/wrappers';
import {Notify, SessionStorage} from "app/node_modules/quasar";
import {ResponseStatus} from "../../../server/src/interfaces/IResponse";
import {auth} from "firebase";

declare module 'vue/types/vue' {

	interface Vue {
		$axios: AxiosInstance;
	}
}

const Axios = axios.create({
	baseURL: process.env.API,
	headers: {
		'key': '5f22867a138ed47f287bc41d'
	}
});
Axios.interceptors.response.use(response => {
	return new Promise(resolve => {
		if (response.data.status === ResponseStatus.ERROR) {
			Notify.create({
				message: 'Operation Failed!',
				caption: response.data.message,
				type: 'negative'
			})
			resolve(response)
		} else if (response.data.status === ResponseStatus.ACCESSDENIED) {
			SessionStorage.set('accessDenied', true)
			window.history.back()
			// resolve(response)
		} else if (response.data.status === ResponseStatus.SESSION_EXPIRED) {
			auth().onAuthStateChanged(user => {
				if (user) {
					user.getIdToken(true).then(token => {
						Axios.defaults.headers.authorization = token
						response.config.headers.authorization = token;
						resolve(Axios.request(response.config))
					})
				} else {
					window.location.reload();
				}
			})
		} else {
			resolve(response)
		}
	})
}, error => {
	//alert(JSON.stringify(error));
	if (error.message === 'Network Error') {
		Notify.create({
			caption: "Network will retrying within 5 sec...",
			message: "Network Error",
			type: 'warning',
			timeout: 4000
		})
		return new Promise(resolve => {
			setTimeout(() => {
				return resolve();
			}, 5000)
		}).then(value => {
			return Axios.request(error.config);
		})
	} else {
		return error;
	}
})
export default boot(({Vue}: any) => {
	Vue.prototype.$axios = Axios
});
export {Axios}

import Vuex from 'vuex';
import {Vue} from "vue-property-decorator";
import UserCredential = firebase.auth.UserCredential;


export interface StateInterface {
	user: UserCredential | any
}

export default function () {
	Vue.use(Vuex);

	// @ts-ignore
	return new Vuex.Store<StateInterface>({
		state: {
			user: null
		},
		mutations: {
			setUser(state, user: any) {
				state.user = user
			}
		},
		actions: {},
		getters: {
			User: (state) => state.user
		}
	});

}

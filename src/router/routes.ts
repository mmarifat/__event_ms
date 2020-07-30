import {RouteConfig} from 'vue-router';
import {Route} from "vue-router/types/router";


const routes: RouteConfig[] = [
	{
		path: '/',
		component: () => import('layouts/HomeLayout.vue'),
		children: [
			{
				path: '',
				name: 'dashboard',
				component: () => import('pages/Home.vue'),
				meta: {
					title: (route: Route) => 'Dashboard',
				}
			},
			{
				path: '/profile',
				name: 'profile',
				component: () => import('components/Profile.vue'),
				meta: {
					title: (route: Route) => 'Profile',
				}
			},
			{
				path: '/test',
				name: 'testMe',
				component: () => import('components/TestMe.vue'),
				meta: {
					title: (route: Route) => 'Test',
				}
			},
		], meta: {
			needAuth: true
		}
	}, {
		path: '/login',
		name: 'login',
		component: () => import('pages/Login.vue'),
		meta: {
			needAuth: false,
			title: (route: Route) => 'Login',
		}
	}, {
		path: '/signUp',
		name: 'signUp',
		component: () => import('components/core/SignUp.vue'),
		meta: {
			needAuth: false,
			title: (route: Route) => 'Sign Up',
		}
	}, {
		path: '/facebook',
		name: 'facebook',
		beforeEnter() {
			window.open("https://www.facebook.com/mma.rifat6", "_blank");
		},
		meta: {
			needAuth: true
		}
	}, {
		path: '/github',
		name: 'github',
		beforeEnter() {
			window.open("https://www.github.com/mmarifat", "_blank");
		},
		meta: {
			needAuth: true
		}
	}, {
		path: '/instagram',
		name: 'instagram',
		beforeEnter() {
			window.open("https://www.instagram.com/mma.rifat", "_blank");
		},
		meta: {
			needAuth: true
		}
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '*',
		component: () => import('pages/Error404.vue'),
		meta: {
			needAuth: false,
			title: (route: Route) => 'Error',
		}
	}
];

export default routes;

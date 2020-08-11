/*
 * Author mmarifat<mma.rifat66@gmail.com>
 * Email: mma.rifat66@gmail.com
 * Created on : Friday 31 Jul, 2020 12:44:47 BDT
 */

import {boot} from "quasar/wrappers";
import QColumn from "components/core/QColumn.vue";
import QRow from "components/core/QRow.vue";
import QCol from "components/core/QCol.vue";
import QContainer from "components/core/QContainer.vue";
import {copyToClipboard, date, Notify, SessionStorage} from "quasar";
import firebase, {auth} from "firebase";
import {IFileProperty} from "../../../server/src/interfaces/IFileProperty";
import {ILogin} from "../../../server/src/interfaces/IEssentials";


export function arrayRemove(arr: any[], value: any, field: string | any = null): any[] {
	return arr.filter((ele) => {
		if (field) {
			return ele[field] != value[field];
		} else {
			return ele != value;
		}
	});
}

export function arrayMove(arr: any[], old_index: number, new_index: number = 0) {
	if (new_index >= arr.length) {
		let k = new_index - arr.length + 1;
		while (k--) {
			arr.push(undefined);
		}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr;
}


export interface ICommon {
	rules: {
		required(value: any): boolean | string,
		requiredKeyID(value: any): boolean | string,
		noSpace(value: any): boolean | string,
		requiredIState(value: any): boolean | string,
		requiredDefaultSelect(value: any): boolean | string,
		requiredBool(value: any): boolean | string,
		minAmountOne(value: any): boolean | string,
		number(value: any): boolean | string,
		minAmountZeroZeroOne(value: any): boolean | string,
		email(value: any): boolean | string,
		phone(value: any): boolean | string,
		notFraction(value: any): boolean | string,
		fraction(value: any): boolean | string,
	}

	capitalizeFirstLetter(s: string): string

	reset(o: any): any

	copy(target: any, base: any): any

	duplicate(target: any, base: any): any

	console(): void

	getFileUrl(file: IFileProperty | string, onNull?: string): string

	getFileThumbUrl(file: IFileProperty | string, onNull?: string): string

	hasPermission(...permissions: any[]): boolean

	convertDate(rawDate: Date | string, format: string): any

	checkIconType(file: IFileProperty | any): any

	copyText(text: string): any
}

export interface IColor {
	primary: string,
	secondary: string,
	accent: string,
	dark: string,
	positive: string,
	negative: string,
	info: string,
	warning: string,
	red: {
		[s: number]: string
	},
	pink: {
		[s: number]: string
	},
	purple: {
		[s: number]: string
	},
	deepPurple: {
		[s: number]: string
	},
	indigo: {
		[s: number]: string
	},
	blue: {
		[s: number]: string
	},
	lightBlue: {
		[s: number]: string
	},
	cyan: {
		[s: number]: string
	},
	teal: {
		[s: number]: string
	},
	green: {
		[s: number]: string
	},
	lightGreen: {
		[s: number]: string
	},
	lime: {
		[s: number]: string
	},
	yellow: {
		[s: number]: string
	},
	amber: {
		[s: number]: string
	},
	orange: {
		[s: number]: string
	},
	deepOrange: {
		[s: number]: string
	},
	brown: {
		[s: number]: string
	},
	grey: {
		[s: number]: string
	},
	blueGrey: {
		[s: number]: string
	},
}

export interface IEditor {
	editorFonts: {
		[s: string]: string
	},
	editorToolbar: Array<any>,
	editorToolbarDefinitions: any
}

export const common: ICommon = {
	rules: {
		required: (v: any) => {
			return (v !== null && v !== undefined ? !!v.toString().length : false) || 'Field is required!'
		},
		noSpace: (v: string) => {
			return !(/^\s/i.test(v)) || 'No Space is accepted!'
		},
		requiredIState: (v: any) => {
			return (!!v && !!v.abbreviation) || 'Field is required!'
		},
		requiredDefaultSelect: (v: any) => {
			return (!!v && !!v.value.length) || 'Field is required!'
		},
		requiredKeyID: (v: any) => {
			return (!!v && !!v._id.length) || 'Field is required!'
		},
		requiredBool: (v: any) => {
			return v || 'Field is required!'
		},
		number: (v: any) => !isNaN(v) || 'Only Number!',

		minAmountOne(v: number) {
			return (v >= 1) || 'Minimum 1 !'
		},
		minAmountZeroZeroOne(v: number) {
			return (v >= 0.001) || 'Minimum 0.001 !'
		},
		email: (v: string) => {
			let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return reg.test(v) || 'Not a valid email!'
		},
		phone: (v: string) => {
			let reg = /^([+]{1}[8]{2}|0088)?(01){1}[3-9]{1}\d{8}$/;
			return !v.length || reg.test(v) || 'Not a valid Phone!'
		},
		notFraction: (v: any) => {
			let reg = /^\d*$/g;
			return reg.test(v) || "Can't be Fraction!"
		},
		fraction: (v: any) => {
			let reg = /^\d\d*\.\d\d$/g;
			return reg.test(v) || "Must be 2 Decimal Fraction!"
		}
	},
	capitalizeFirstLetter: (string: string) => {
		return string.length ? string[0].toUpperCase() + string.slice(1) : '';
	},

	reset: (obj: any) => {
		Object.keys(obj).forEach(key => {
			if (Array.isArray(obj[key])) {
				obj[key] = [];
			} else if (typeof obj[key] == "object") {
				common.reset(obj[key]);
			} else if (typeof obj[key] == "number" || typeof obj[key] == "bigint") {
				obj[key] = 0
			} else if (typeof obj[key] == "string") {
				obj[key] = ''
			} else {
				obj[key] = null
			}
		})
		return obj;
	},

	copy(target: any, base: any) {
		if (base) {
			Object.keys(target).forEach(key => {
				if (Array.isArray(base[key])) {
					target[key] = base[key]
				} else if (typeof base[key] == "object") {
					common.copy(target[key], base[key]);
				} else {
					target[key] = base[key]
				}
			})
		}
		return target;
	},


	duplicate(target: any, base: any) {
		if (base) {
			Object.keys(target).forEach(key => {
				if (Array.isArray(base[key])) {
					target[key] = base[key]
				} else if (typeof base[key] == "object") {
					common.duplicate(target[key], base[key]);
				} else {
					target[key] = base[key] || target[key]
				}
			})
		}
		return target;
	},

	console() {
		console.log(arguments);
	},

	getFileUrl(file: IFileProperty | string, onNull?: string) {
		if (file) {
			if (typeof file === 'string') {
				return 'statics/' + file
			} else {
				return process.env.API + '/statics/' + file.path
			}
		} else {
			return (onNull || 'images/not_available.svg')
		}

	},
	getFileThumbUrl(file: IFileProperty | string, onNull?: string) {
		if (file) {
			if (typeof file === 'string') {
				return 'statics/' + file
			} else {
				return process.env.API + '/statics/thumbs/' + file.name
			}
		} else {
			return onNull || 'images/not_available.svg'
		}

	},

	hasPermission(...permissions: any[]): boolean {
		if (!SessionStorage.getItem('isDev')) {
			let permitted = false
			permissions.forEach((value: any) => {
				if (typeof value === "object") {
					permitted = getBool(value) || permitted;
				} else {
					permitted = value || permitted
				}
			})
			return permitted
		} else {
			return true
		}
	},
	convertDate(rawDate: Date | string, format: string) {
		return date.formatDate(rawDate, format)
	},

	checkIconType(file: IFileProperty | any) {
		let icon = null
		let type = file.originalName.split('.')[file.originalName.split('.').length - 1]
		if (/docx|odt|doc|dot|dotx|docm|dotm/.test(type))
			icon = 'far fa-file-word'
		else if (/xlsx|csv|xls|xlt|xla|xlts|xlsm|xltm|xlam|xlsb/.test(type))
			icon = 'far fa-file-excel'
		else if (/zip/.test(type))
			icon = 'far fa-file-archive'
		else if (/pdf/.test(type))
			icon = 'far fa-file-pdf'
		else
			icon = 'far fa-file'
		return icon
	},

	copyText(text: string) {
		copyToClipboard(text).then(() => {
			Notify.create({
				message: 'Copied to Clipboard!',
				caption: text,
				icon: 'content_copy',
				type: 'positive'
			})
		}).catch(() => {
			Notify.create({
				message: 'Copy Failed!!',
				caption: text,
				icon: 'content_copy',
				type: 'negative'
			})
		})
	}
}

export const color: IColor = {
	primary: 'primary',
	secondary: 'secondary',
	accent: 'accent',
	dark: 'dark',
	positive: 'positive',
	negative: 'negative',
	info: 'info',
	warning: 'warning',
	red: {
		0: "red",
		1: "red-1",
		2: "red-2",
		3: "red-3",
		4: "red-4",
		5: "red-5",
		6: "red-6",
		7: "red-7",
		8: "red-8",
		9: "red-9",
		10: "red-10",
		11: "red-11",
		12: "red-12",
		13: "red-13",
		14: "red-14",
	},
	pink: {
		0: "pink",
		1: "pink-1",
		2: "pink-2",
		3: "pink-3",
		4: "pink-4",
		5: "pink-5",
		6: "pink-6",
		7: "pink-7",
		8: "pink-8",
		9: "pink-9",
		10: "pink-10",
		11: "pink-11",
		12: "pink-12",
		13: "pink-13",
		14: "pink-14",
	},
	purple: {
		0: "purple",
		1: "purple-1",
		2: "purple-2",
		3: "purple-3",
		4: "purple-4",
		5: "purple-5",
		6: "purple-6",
		7: "purple-7",
		8: "purple-8",
		9: "purple-9",
		10: "purple-10",
		11: "purple-11",
		12: "purple-12",
		13: "purple-13",
		14: "purple-14",
	},
	deepPurple: {
		0: "deep-purple",
		1: "deep-purple-1",
		2: "deep-purple-2",
		3: "deep-purple-3",
		4: "deep-purple-4",
		5: "deep-purple-5",
		6: "deep-purple-6",
		7: "deep-purple-7",
		8: "deep-purple-8",
		9: "deep-purple-9",
		10: "deep-purple-10",
		11: "deep-purple-11",
		12: "deep-purple-12",
		13: "deep-purple-13",
		14: "deep-purple-14",
	},
	indigo: {
		0: "indigo",
		1: "indigo-1",
		2: "indigo-2",
		3: "indigo-3",
		4: "indigo-4",
		5: "indigo-5",
		6: "indigo-6",
		7: "indigo-7",
		8: "indigo-8",
		9: "indigo-9",
		10: "indigo-10",
		11: "indigo-11",
		12: "indigo-12",
		13: "indigo-13",
		14: "indigo-14",
	},
	blue: {
		0: "blue",
		1: "blue-1",
		2: "blue-2",
		3: "blue-3",
		4: "blue-4",
		5: "blue-5",
		6: "blue-6",
		7: "blue-7",
		8: "blue-8",
		9: "blue-9",
		10: "blue-10",
		11: "blue-11",
		12: "blue-12",
		13: "blue-13",
		14: "blue-14",
	},
	lightBlue: {
		0: "light-blue",
		1: "light-blue-1",
		2: "light-blue-2",
		3: "light-blue-3",
		4: "light-blue-4",
		5: "light-blue-5",
		6: "light-blue-6",
		7: "light-blue-7",
		8: "light-blue-8",
		9: "light-blue-9",
		10: "light-blue-10",
		11: "light-blue-11",
		12: "light-blue-12",
		13: "light-blue-13",
		14: "light-blue-14",
	},
	cyan: {
		0: "cyan",
		1: "cyan-1",
		2: "cyan-2",
		3: "cyan-3",
		4: "cyan-4",
		5: "cyan-5",
		6: "cyan-6",
		7: "cyan-7",
		8: "cyan-8",
		9: "cyan-9",
		10: "cyan-10",
		11: "cyan-11",
		12: "cyan-12",
		13: "cyan-13",
		14: "cyan-14",
	},
	teal: {
		0: "teal",
		1: "teal-1",
		2: "teal-2",
		3: "teal-3",
		4: "teal-4",
		5: "teal-5",
		6: "teal-6",
		7: "teal-7",
		8: "teal-8",
		9: "teal-9",
		10: "teal-10",
		11: "teal-11",
		12: "teal-12",
		13: "teal-13",
		14: "teal-14",
	},
	green: {
		0: "green",
		1: "green-1",
		2: "green-2",
		3: "green-3",
		4: "green-4",
		5: "green-5",
		6: "green-6",
		7: "green-7",
		8: "green-8",
		9: "green-9",
		10: "green-10",
		11: "green-11",
		12: "green-12",
		13: "green-13",
		14: "green-14",
	},
	lightGreen: {
		0: "light-green",
		1: "light-green-1",
		2: "light-green-2",
		3: "light-green-3",
		4: "light-green-4",
		5: "light-green-5",
		6: "light-green-6",
		7: "light-green-7",
		8: "light-green-8",
		9: "light-green-9",
		10: "light-green-10",
		11: "light-green-11",
		12: "light-green-12",
		13: "light-green-13",
		14: "light-green-14",
	},
	lime: {
		0: "lime",
		1: "lime-1",
		2: "lime-2",
		3: "lime-3",
		4: "lime-4",
		5: "lime-5",
		6: "lime-6",
		7: "lime-7",
		8: "lime-8",
		9: "lime-9",
		10: "lime-10",
		11: "lime-11",
		12: "lime-12",
		13: "lime-13",
		14: "lime-14",
	},
	yellow: {
		0: "yellow",
		1: "yellow-1",
		2: "yellow-2",
		3: "yellow-3",
		4: "yellow-4",
		5: "yellow-5",
		6: "yellow-6",
		7: "yellow-7",
		8: "yellow-8",
		9: "yellow-9",
		10: "yellow-10",
		11: "yellow-11",
		12: "yellow-12",
		13: "yellow-13",
		14: "yellow-14",
	},
	amber: {
		0: "amber",
		1: "amber-1",
		2: "amber-2",
		3: "amber-3",
		4: "amber-4",
		5: "amber-5",
		6: "amber-6",
		7: "amber-7",
		8: "amber-8",
		9: "amber-9",
		10: "amber-10",
		11: "amber-11",
		12: "amber-12",
		13: "amber-13",
		14: "amber-14",
	},
	orange: {
		0: "orange",
		1: "orange-1",
		2: "orange-2",
		3: "orange-3",
		4: "orange-4",
		5: "orange-5",
		6: "orange-6",
		7: "orange-7",
		8: "orange-8",
		9: "orange-9",
		10: "orange-10",
		11: "orange-11",
		12: "orange-12",
		13: "orange-13",
		14: "orange-14",
	},
	deepOrange: {
		0: "deep-orange",
		1: "deep-orange-1",
		2: "deep-orange-2",
		3: "deep-orange-3",
		4: "deep-orange-4",
		5: "deep-orange-5",
		6: "deep-orange-6",
		7: "deep-orange-7",
		8: "deep-orange-8",
		9: "deep-orange-9",
		10: "deep-orange-10",
		11: "deep-orange-11",
		12: "deep-orange-12",
		13: "deep-orange-13",
		14: "deep-orange-14",
	},
	brown: {
		0: "brown",
		1: "brown-1",
		2: "brown-2",
		3: "brown-3",
		4: "brown-4",
		5: "brown-5",
		6: "brown-6",
		7: "brown-7",
		8: "brown-8",
		9: "brown-9",
		10: "brown-10",
		11: "brown-11",
		12: "brown-12",
		13: "brown-13",
		14: "brown-14",
	},
	grey: {
		0: "grey",
		1: "grey-1",
		2: "grey-2",
		3: "grey-3",
		4: "grey-4",
		5: "grey-5",
		6: "grey-6",
		7: "grey-7",
		8: "grey-8",
		9: "grey-9",
		10: "grey-10",
		11: "grey-11",
		12: "grey-12",
		13: "grey-13",
		14: "grey-14",
	},
	blueGrey: {
		0: "blue-grey",
		1: "blue-grey-1",
		2: "blue-grey-2",
		3: "blue-grey-3",
		4: "blue-grey-4",
		5: "blue-grey-5",
		6: "blue-grey-6",
		7: "blue-grey-7",
		8: "blue-grey-8",
		9: "blue-grey-9",
		10: "blue-grey-10",
		11: "blue-grey-11",
		12: "blue-grey-12",
		13: "blue-grey-13",
		14: "blue-grey-14",
	},
}

export const editor: IEditor = {
	editorFonts: {
		arial: 'Arial',
		arial_black: 'Arial Black',
		comic_sans: 'Comic Sans MS',
		courier_new: 'Courier New',
		impact: 'Impact',
		lucida_grande: 'Lucida Grande',
		times_new_roman: 'Times New Roman',
		verdana: 'Verdana'
	},

	editorToolbar: [[
		{
			label: 'Align',
			icon: 'format_align_left',
			fixedLabel: false,
			options: ['left', 'center', 'right', 'justify']
		},
		{
			label: 'Formatting',
			icon: 'text_format',
			list: 'no-icons',
			options: [
				'p',
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'code'
			]
		},
		{
			label: 'Font Size',
			icon: 'format_size',
			fixedLabel: true,
			fixedIcon: true,
			list: 'no-icons',
			options: [
				'size-1',
				'size-2',
				'size-3',
				'size-4',
				'size-5',
				'size-6',
				'size-7'
			]
		},
		{
			label: 'Default Font',
			icon: 'font_download',
			fixedIcon: true,
			list: 'no-icons',
			options: [
				'default_font',
				'arial',
				'arial_black',
				'comic_sans',
				'courier_new',
				'impact',
				'lucida_grande',
				'times_new_roman',
				'verdana'
			]
		},
		'bold', 'hr', 'italic', 'strike', 'underline', 'subscript', 'superscript', 'token', 'link',
		'quote', 'unordered', 'ordered', 'outdent', 'indent', 'undo', 'redo', 'removeFormat', 'viewsource', 'print', 'fullscreen'
	],
	],

	editorToolbarDefinitions: {}
}

function getBool(object: any): any {
	let bool = false
	for (let i in object) {
		if (typeof object[i] === "object") {
			bool = getBool(object[i]) || bool
		} else {
			bool = object[i] || bool
		}
	}
	return bool
}

declare module 'vue/types/vue' {
	interface Vue {
		$common: ICommon
		$colors: IColor
		$editor: IEditor
		$fb: firebase.firestore.Firestore
	}
}

export default boot(({Vue, app}: any) => {
	Vue.component('QColumn', QColumn);
	Vue.component('QRow', QRow);
	Vue.component('QCol', QCol);
	Vue.component('QContainer', QContainer);
	Vue.prototype.$common = common
	Vue.prototype.$colors = color
	Vue.prototype.$editor = editor
});

export async function signUp(info: any) {
	return new Promise((resolve, reject) => {
		auth().createUserWithEmailAndPassword(info.email, info.password)
			  .then((userCredential) => {
				  userCredential.user?.updateProfile({
					  displayName: info.username
				  }).then(() => {
					  resolve(userCredential)
				  })
			  })
			  .catch((reason) => reject(reason));
	});
}

export async function signIn(info: ILogin) {
	return new Promise((resolve, reject) => {
		auth().signInWithEmailAndPassword(info.email, info.password)
			  .then((userCredential) => resolve(userCredential))
			  .catch((reason) => reject(reason));
	});
}

export async function logOut() {
	return new Promise((resolve, reject) => {
		auth().signOut()
			  .then((userCredential) => resolve(userCredential))
			  .catch((reason) => reject(reason));
	});
}

export async function googleSignIn() {
	let provider = new auth.GoogleAuthProvider();
	return new Promise((resolve, reject) => {
		auth().signInWithPopup(provider)
			  .then((userCredential) => resolve(userCredential))
			  .catch((reason) => reject(reason))
	});
}


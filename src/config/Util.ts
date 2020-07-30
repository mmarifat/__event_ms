/*
 * Author mmarifat<mma.rifat66@gmail.com>
 * Email: mma.rifat66@gmail.com
 * Created on : Friday 31 Jul, 2020 12:51:05 BDT
 */

export const objectToFormData = (obj: any, form: any = null, namespace: any = null) => {
	let fd = form || new FormData();
	let formKey;
	for (let property in obj) {
		if (obj.hasOwnProperty(property)) {
			if (namespace) {
				formKey = namespace + '[' + property + ']';
			} else {
				formKey = property;
			}
			if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
				objectToFormData(obj[property], fd, property);
			} else {
				fd.append(formKey, obj[property]);
			}

		}
	}
	return fd;
};

export function jsonToMap<T>(objs: T[], primaryKey: string = '_id') {
	let obs: Map<string, T> = new Map<string, T>();
	objs.forEach(value => {
		// @ts-ignore
		obs.set(value[primaryKey], value)
	})
	return obs;
}

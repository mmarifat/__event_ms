import {AxiosInterceptorManager, AxiosPromise, AxiosRequestConfig, AxiosResponse} from "axios";
import {IResponse} from "../../server/src/interfaces/IResponse";

declare global {
	export interface AxiosInstance {
		(config: AxiosRequestConfig): AxiosPromise;

		(url: string, config?: AxiosRequestConfig): AxiosPromise;

		defaults: AxiosRequestConfig;
		interceptors: {
			request: AxiosInterceptorManager<AxiosRequestConfig>;
			response: AxiosInterceptorManager<AxiosResponse>;
		};

		getUri(config?: AxiosRequestConfig): string;

		request<T = IResponse, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R>;

		get<T = IResponse, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;

		delete<T = IResponse, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;

		head<T = IResponse, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;

		options<T = IResponse, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;

		post<T = IResponse, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;

		put<T = IResponse, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;

		patch<T = IResponse, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
	}
}

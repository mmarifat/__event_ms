export enum ResponseStatus {
	SUCCESS = 200,
	FAILED = 204,
	ERROR = 400,
	SESSION_EXPIRED = 401,
	ACCESSDENIED = 403,
	INVALID = 404
}

export interface IDataTableResponse {
	rows: any
	total: number
	showing?: number
	filtered: number
	timeInSec: number
}

export interface IDataTableFilter {
	date?: string []
	fields: string[]
	category?: any
	search: string
	mailingDate?: string[]
	orderDate?: string[]
	processingDate?: string[]
	pendingDate?: string[]
	completedDate?: string[]
	refundedDate?: string[]

	[s: string]: any
}

export interface IResponse {
	status: ResponseStatus
	isSuccess?: boolean
	data?: any | IDataTableResponse
	message?: string
	caption?: string

	[prop: string]: any
}

export interface IDataTablePagination {
	sortBy: string
	descending: boolean
	page: number
	rowsPerPage: number
	rowsNumber: number

}

export interface IDataTableRequest {
	pagination: IDataTablePagination
	state: string
	columns: string[]
	filter: any
}

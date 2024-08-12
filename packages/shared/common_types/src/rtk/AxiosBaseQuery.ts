import type { BaseQueryFn }        from "@reduxjs/toolkit/query"
import type { AxiosRequestConfig } from "axios"

export type AxiosBaseQueryParams = {
    baseUrl: string;
    withHeaders?: () => AxiosRequestConfig["headers"];
}

export type AxiosBaseQuery = (options: AxiosBaseQueryParams) =>
	BaseQueryFn<
		{
			url: string
			method: AxiosRequestConfig["method"]
			data?: AxiosRequestConfig["data"]
			params?: AxiosRequestConfig["params"]
		},
		unknown,
		unknown
	>;
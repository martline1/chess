import axios                                   from "axios";
import type { AxiosError, AxiosRequestConfig } from "axios";

import { AxiosBaseQuery } from "@common_types/rtk";

export const axiosBaseQuery: AxiosBaseQuery = ({ baseUrl, withHeaders })  => async ({
	url,
    method,
    data,
    params,
}) => {
	try {
        const requestConfig: AxiosRequestConfig = {
            url : baseUrl + url,
            method,
            data,
            params,
        };

        if (withHeaders) {
            requestConfig.headers = withHeaders();
        }

		const result = await axios(requestConfig);

		return { data : result.data };
	} catch (axiosError) {
		const err = axiosError as AxiosError;
		return {
			error : {
				status : err.response?.status,
				data   : err.response?.data || err.message,
			},
		};
	}
};

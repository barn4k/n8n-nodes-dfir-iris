import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import { customDebug } from '../helpers/utils';
import type FormData from 'form-data';

export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | FormData = {},
	query?: IDataObject,
	option: IDataObject = {},
	isFormData: boolean = false,
): Promise<any> {
	const credentials = await this.getCredentials('dfirIrisApi');
	const baseUrl = (credentials?.isHttp ? 'http://' : 'https://') + credentials?.host;
	let headers = { 'content-type': 'application/json; charset=utf-8' };

	if (isFormData) headers = { 'content-type': 'multipart/form-data; charset=utf-8' };

	query = query || {};

	const disableSslChecks = credentials.isHttp
		? true
		: (credentials.allowUnauthorizedCerts as boolean);

	let options: IHttpRequestOptions = {
		headers: headers,
		method,
		url: `${baseUrl}/${endpoint}`,
		body,
		qs: query,
		json: true,
		skipSslCertificateValidation: disableSslChecks,
		ignoreHttpStatusErrors: true,
	};
	if (Object.keys(option).length > 0) {
		options = Object.assign({}, options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(query).length === 0) {
		delete options.qs;
	}

	Object.assign(options, { rejectUnauthorized: disableSslChecks });

	try {
		customDebug('options', options)
		return await this.helpers.requestWithAuthentication.call(this, 'dfirIrisApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function apiRequestAll(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject,
	max_items: number = 0,
	propKey: string,
): Promise<any> {
	const credentials = await this.getCredentials('dfirIrisApi');
	const baseUrl = (credentials?.isHttp ? 'http://' : 'https://') + credentials?.host;
	let headers = { 'content-type': 'application/json; charset=utf-8' };

	query = query || {};
	let returnData: IDataObject[] = [];
	let responseData;
	let proceed = true;
	const disableSslChecks = credentials.isHttp
		? true
		: (credentials.allowUnauthorizedCerts as boolean);

	query.page = 1;
	query.per_page = max_items > 0 && max_items < 100 ? max_items : 100;

	let options: IHttpRequestOptions = {
		headers: headers,
		method,
		url: `${baseUrl}/${endpoint}`,
		body,
		qs: query,
		json: true,
		skipSslCertificateValidation: disableSslChecks,
		ignoreHttpStatusErrors: true,
	};

	Object.assign(options, { rejectUnauthorized: disableSslChecks });

	customDebug('req options: ', options)
	do {
		try {
			responseData = await this.helpers.requestWithAuthentication.call(this, 'dfirIrisApi', {
				...options,
				rejectUnauthorized: true,
			});
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}

		// for troubleshooting
		customDebug('responseData', responseData)
		// proceed = false

		customDebug('current_page: ',responseData.data.current_page)
		customDebug('next_page: ', responseData.data.next_page)
		customDebug('last_page: ',responseData.data.last_page)
		customDebug('total: ',responseData.data.total)

		returnData.push(...responseData.data[propKey]);

		customDebug('max_items: ', max_items)
		customDebug('returnData.length: ', returnData.length)

		if (max_items > 0 && returnData.length >= max_items) {
			proceed = false;
		} else if (
			!responseData.data.next_page ||
			responseData.data.next_page === 'null' ||
			responseData.data.next_page === null
		) {
			proceed = false;
		} else {
			// @ts-ignore
			options.qs.page = responseData.data.next_page;
		}
	} while (proceed);

	if (max_items > 0) returnData = returnData.slice(0, max_items);

	responseData.data[propKey] = returnData;
	return responseData;
}

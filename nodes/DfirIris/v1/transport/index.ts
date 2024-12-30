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

	let options: IHttpRequestOptions = {
		headers: headers,
		method,
		url: `${baseUrl}/${endpoint}`,
		body,
		qs: query,
		json: true,
		skipSslCertificateValidation: credentials.isHttp
			? true
			: (credentials.allowUnauthorizedCerts as boolean),
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

	try {
		console.debug('options', options);
		this.logger.debug('options', options);
		return await this.helpers.requestWithAuthentication.call(this, 'dfirIrisApi', {
			...options,
			rejectUnauthorized: true,
		});
		// return await this.helpers.httpRequestWithAuthentication.call(this, 'dfirIrisApi', {...options, rejectUnauthorized: true});
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

	query.page = 1;
	query.per_page = max_items > 0 && max_items < 100 ? max_items : 100;

	let options: IHttpRequestOptions = {
		headers: headers,
		method,
		url: `${baseUrl}/${endpoint}`,
		body,
		qs: query,
		json: true,
		skipSslCertificateValidation: credentials.isHttp
			? true
			: (credentials.allowUnauthorizedCerts as boolean),
		ignoreHttpStatusErrors: true,
	};

	console.debug('req body: ', options.body);
	console.debug('req query: ', options.qs);
	do {
		try {
			responseData = await this.helpers.requestWithAuthentication.call(this, 'dfirIrisApi', {
				...options,
				rejectUnauthorized: true,
			});
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
		// console.debug('max_items: ',max_items)
		// console.debug('current_page: ',responseData.data.current_page)
		// console.debug('next_page: ', responseData.data.next_page)
		// console.debug('last_page: ',responseData.data.last_page)
		// console.debug('total: ',responseData.data.total)

		returnData.push(...responseData.data[propKey]);

		if (responseData.data.next_page || (returnData.length >= max_items && max_items > 0)) {
			// @ts-ignore
			options.qs.page = responseData.data.next_page;
		} else {
			proceed = false;
		}

		// if (
		// 	responseData.data.current_page >= responseData.data.last_page ||
		// 	responseData.data.total === 0 ||
		// 	(returnData.length >= max_items && max_items > 0)
		// )
		// 	proceed = false;
	} while (proceed);

	if (max_items > 0) returnData = returnData.slice(0, max_items);

	responseData.data[propKey] = returnData;
	return responseData;
}

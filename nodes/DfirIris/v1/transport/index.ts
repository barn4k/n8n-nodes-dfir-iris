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

import { enableDebug, IrisLog } from '../helpers/utils';

export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query?: IDataObject,
	option: IDataObject = {},
	isFormData: boolean = false,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('dfirIrisApi');

	enableDebug(credentials?.enableDebug as boolean)
	const irisLogger = new IrisLog(this.logger);

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
		irisLogger.info('options', {options});
		return await this.helpers.httpRequestWithAuthentication.call(this, 'dfirIrisApi', options);
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
	start_page: number = 1,
	propKey: string,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('dfirIrisApi');

	enableDebug(credentials?.enableDebug as boolean)

	const baseUrl = (credentials?.isHttp ? 'http://' : 'https://') + credentials?.host;
	const headers = { 'content-type': 'application/json; charset=utf-8' };
	const irisLogger = new IrisLog(this.logger);

	query = query || {};
	let returnData: IDataObject[] = [];
	let responseData;
	let proceed = true;
	const disableSslChecks = credentials.isHttp
		? true
		: (credentials.allowUnauthorizedCerts as boolean);

	query.page = start_page;
	query.per_page = max_items > 0 && max_items < 100 ? max_items : 100;

	if (start_page > 1){
		query.page = Math.floor(start_page * max_items / query.per_page)
	}

	const options: IHttpRequestOptions = {
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

	irisLogger.info('req options: ', {options});
	do {
		try {
			responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'dfirIrisApi', {
				...options,
				rejectUnauthorized: true,
			});
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}

		// for troubleshooting
		irisLogger.info('responseData', {responseData});
		// proceed = false

		irisLogger.info('current_page: ', responseData.data.current_page);
		irisLogger.info('next_page: ', responseData.data.next_page);
		irisLogger.info('last_page: ', responseData.data.last_page);
		irisLogger.info('total: ', responseData.data.total);

		returnData.push(...responseData.data[propKey]);

		irisLogger.info(`max_items: ${max_items}`);
		irisLogger.info(`returnData.length: ${returnData.length}`);

		if (max_items > 0 && returnData.length >= max_items) {
			proceed = false;
		} else if (
			!responseData.data.next_page ||
			responseData.data.next_page === 'null' ||
			responseData.data.next_page === null
		) {
			proceed = false;
		} else {
			if (options.qs && typeof options.qs === 'object'){
				options.qs.page = responseData.data.next_page;
			}
		}
	} while (proceed);

	if (max_items > 0) returnData = returnData.slice(0, max_items);

	responseData.data[propKey] = returnData;
	return responseData;
}

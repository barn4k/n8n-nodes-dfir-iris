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
// import { IFolder } from '../helpers/types';

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

// export async function getFolderName(
// 	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
// 	query: IDataObject,
// 	folder: string,
// ): Promise<any> {
// 	const response = (await apiRequest.call(
// 		this,
// 		'GET',
// 		'datastore/list/tree',
// 		{},
// 		query,
// 	)) as IFolder;
// 	this.logger.debug('getFolderResponse', response);
// 	if (folder === 'root') return parseInt(Object.keys(response.data)[0].replace('d-', ''));
// 	else {
// 		const subs = Object.values(response.data)[0].children as object;
// 		let returnedFolder: string = '';
// 		try {
// 			if (folder === 'evidences')
// 				returnedFolder = Object.entries(subs).filter((s) => s[1].name === 'Evidences')[0][0];
// 			else if (folder === 'iocs')
// 				returnedFolder = Object.entries(subs).filter((s) => s[1].name === 'IOCs')[0][0];
// 			else if (folder === 'images')
// 				returnedFolder = Object.entries(subs).filter((s) => s[1].name === 'Images')[0][0];
// 			return parseInt(returnedFolder.replace('d-', ''));
// 		} catch (error) {
// 			throw new NodeApiError(this.getNode(), error as JsonObject);
// 		}
// 	}
// }

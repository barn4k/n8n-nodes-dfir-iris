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
import {
	NodeApiError,
} from 'n8n-workflow';

export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject,
	query?: IDataObject,
	option: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('dfirIrisApi');
	const baseUrl = (credentials?.isHttp ? "http://" : "https://") + credentials?.host;

	query = query || {};

	const options: IHttpRequestOptions = {
		headers: {'content-type': 'application/json; charset=utf-8',},
		method,
		url: `${baseUrl}/${endpoint}`,
		body,
		qs: query,
		json: true,
		skipSslCertificateValidation: credentials.isHttp ? true : credentials.allowUnauthorizedCerts as boolean,
		ignoreHttpStatusErrors: true,
	};
	if (Object.keys(option).length > 0) {
		Object.assign(options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(query).length === 0) {
		delete options.qs;
	}

	try {
		this.logger.debug('options', options)
		return await this.helpers.requestWithAuthentication.call(this, 'dfirIrisApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

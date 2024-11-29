// import type {
// 	IExecuteFunctions,
// 	IHookFunctions,
// 	ILoadOptionsFunctions,
// 	GenericValue,
// 	IDataObject,
// 	IHttpRequestMethods,
// 	IHttpRequestOptions,
// } from 'n8n-workflow';

// const apiName = "dfirIrisApi"
// function compareVersions(a: string, b: string){
// 	//  1 - a > b
// 	//  0 - a = b
// 	// -1 - a < b
// 	return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
// }
// /**
//  * Make an API request to IRIS
//  */
// export async function apiRequest(
// 	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
// 	method: IHttpRequestMethods,
// 	endpoint: string,
// 	body: IDataObject | GenericValue | GenericValue[] = {},
// 	query: IDataObject = {},
// ) {

// 	this.logger.verbose("iris > transport > apiRequest called")

// 	const credentials = await this.getCredentials(apiName);

// 	let credTemp = Object.assign({}, credentials)
// 	credTemp.token = (credTemp.token as string).slice(0,4)+"XXXXXX"
// 	this.logger.debug('cred', credTemp)
// 	const baseUrl = (credentials?.isHttp ? "http://" : "https://") + credentials?.host;

// 	const apiVer = credentials?.apiVersion as string
// 	const apiVerOptions: IHttpRequestOptions = {
// 		method: 'GET',
// 		body: {},
// 		qs: {},
// 		url: `${baseUrl}/api/versions`,
// 		headers: {
// 			'content-type': 'application/json; charset=utf-8',
// 		},
// 		skipSslCertificateValidation: credentials.allowUnauthorizedCerts as boolean,
// 	};
// 	const apiVerResponse = await this.helpers.httpRequestWithAuthentication.call(this, apiName, apiVerOptions);

// 	const apiMin = apiVerResponse?.data?.api_min
// 	const apiMax = apiVerResponse?.data?.api_current
// 	const srvVer = apiVerResponse?.data?.iris_current

// 	if (compareVersions(apiVer, apiMin) < 0 || compareVersions(apiVer, apiMax) > 0 ) {
// 		throw new Error(`API version is not supported. Used: v${apiVer}, supported: v${apiMin}-${apiMax}. Server version: ${srvVer}`)
// 	}

// 	const options: IHttpRequestOptions = {
// 		method,
// 		body,
// 		qs: query,
// 		url: `${baseUrl}/${endpoint}`,
// 		headers: {
// 			'content-type': 'application/json; charset=utf-8',
// 		},
// 		skipSslCertificateValidation: credentials.allowUnauthorizedCerts as boolean,
// 	};

// 	this.logger.debug("iris > apiRequest > baseUrl: "+baseUrl)
// 	this.logger.debug("iris > apiRequest > options: "+JSON.stringify(options))

// 	return await this.helpers.httpRequestWithAuthentication.call(this, apiName, options);
// }

// export async function apiRequestAllItems(
// 	this: IExecuteFunctions | ILoadOptionsFunctions,
// 	method: 'GET' | 'POST',
// 	endpoint: string,
// 	body: IDataObject = {},
// 	query: IDataObject = {},
// ) {
// 	const returnData: IDataObject[] = [];

// 	let responseData;
// 	query.page = 0;
// 	query.per_page = 100;

// 	do {
// 		responseData = await apiRequest.call(this, method, endpoint, body, query);
// 		query.page++;
// 		returnData.push.apply(returnData, responseData as IDataObject[]);
// 	} while (responseData.length !== 0);

// 	return returnData;
// }

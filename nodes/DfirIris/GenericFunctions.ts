import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
	IWebhookFunctions,
	JsonObject,
	INodeProperties,
	INodePropertyOptions,
} from 'n8n-workflow';
import {
	NodeApiError,
	NodeOperationError,
	// INodeProperties,
	// jsonParse
} from 'n8n-workflow';


// export interface IFieldProperty {
// 	name: string,
// 	value: string
// }

// Interface in n8n
// export interface IMarkupKeyboard {
// 	rows?: IMarkupKeyboardRow[];
// }

// export interface IMarkupKeyboardRow {
// 	row?: IMarkupKeyboardRow;
// }

// export interface IMarkupKeyboardRow {
// 	buttons?: IMarkupKeyboardButton[];
// }

// export interface IMarkupKeyboardButton {
// 	text: string;
// 	additionalFields?: IDataObject;
// }

// // Interface in Telegram
// export interface ITelegramInlineReply {
// 	inline_keyboard?: ITelegramKeyboardButton[][];
// }

// export interface ITelegramKeyboardButton {
// 	[key: string]: string | number | boolean;
// }

// export interface ITelegramReplyKeyboard extends IMarkupReplyKeyboardOptions {
// 	keyboard: ITelegramKeyboardButton[][];
// }

// // Shared interfaces
// export interface IMarkupForceReply {
// 	force_reply?: boolean;
// 	selective?: boolean;
// }

// export interface IMarkupReplyKeyboardOptions {
// 	one_time_keyboard?: boolean;
// 	resize_keyboard?: boolean;
// 	selective?: boolean;
// }

// export interface IMarkupReplyKeyboardRemove {
// 	force_reply?: boolean;
// 	selective?: boolean;
// }

export const addCaseId: INodeProperties[] = [{
		displayName: 'Case Id',
		name: 'cid',
		type: 'number',
		default: 1,
		displayOptions: {
			show: {
				// operation: [
				// 	'get',
				// ],
				resource: ['note', 'task'],
			},
		},
		required: true,
		description: 'Case Id',
}]

export function fieldProperties(fields: string[]){
	return [
		{
			displayName: 'Return Fields',
			name: 'fields',
			type: 'multiOptions',
			options: fields.map( (f) => { return {name: f, value: f} } ),
			default: [],
			description: 'Fields to be included',
		},
		{
			displayName: 'Exclude',
			name: 'inverseFields',
			type: 'boolean',
			options: fields.map( (f) => { return {name: f, value: f} } ),
			default: false,
			description: 'if the selected fields should be excluded instead',
		},
	] as INodeProperties[]
}

export function fieldsRemover(responseData: any, additionalFields: IDataObject){
	const fields = additionalFields.fields as string[] || []
	const inverseFields = additionalFields.inverseFields as boolean || false

	// console.log('fields', fields)
	// console.log('inverseFields', inverseFields)

	if (fields && 'data' in responseData){
		if (Array.isArray(responseData.data)){
			responseData.data.forEach( (row: {[index: string]:any}) => {
				if (inverseFields){
					Object.keys(row).filter(k => fields.includes(k)).forEach( (x: string) => { delete row[x] })
				} else {
					Object.keys(row).filter(k => !fields.includes(k)).forEach( (x: string) => { delete row[x] })
				}
			})
		} else {
			if (inverseFields){
				Object.keys(responseData.data).filter(k => fields.includes(k)).forEach( (x: string) => { delete responseData.data[x] })
			} else {
				Object.keys(responseData.data).filter(k => !fields.includes(k)).forEach( (x: string) => { delete responseData.data[x] })
			}
		}
	}
	return responseData
}

/**
 * Add the additional fields to the body
 *
 * @param {IDataObject} body The body object to add fields to
 * @param {number} index The index of the item
 */
export function addAdditionalFields(
	this: IExecuteFunctions,
	body: IDataObject,
	index: number,
	nodeVersion?: number,
	instanceId?: string,
) {
	// Add the additional fields
	const additionalFields = this.getNodeParameter('additionalFields', index);
	this.logger.debug('additionalFields',additionalFields)
	// remove custom params
	delete additionalFields.isRaw
	delete additionalFields.fields
	delete additionalFields.inverseFields
	delete additionalFields.returnAll
	delete additionalFields.limit


	if (additionalFields.hasOwnProperty('custom_attributes')){
		if(typeof additionalFields.custom_attributes !== 'object'){
			try{
				JSON.parse(additionalFields.custom_attributes as string)
			} catch {
				throw new NodeOperationError(
					this.getNode(),
					'JSON parameter needs to be valid JSON',
					{
						itemIndex: index,
					},
				);
			}
			additionalFields.custom_attributes = JSON.parse(additionalFields.custom_attributes as string)
		}
	}

	Object.assign(body, additionalFields);

}
// 	if (operation === 'sendMessage') {
// 		const attributionText = 'This message was sent automatically with ';
// 		const link = `https://n8n.io/?utm_source=n8n-internal&utm_medium=powered_by&utm_campaign=${encodeURIComponent(
// 			'n8n-nodes-base.telegram',
// 		)}${instanceId ? '_' + instanceId : ''}`;

// 		if (nodeVersion && nodeVersion >= 1.1 && additionalFields.appendAttribution === undefined) {
// 			additionalFields.appendAttribution = true;
// 		}

// 		if (!additionalFields.parse_mode) {
// 			additionalFields.parse_mode = 'Markdown';
// 		}

// 		const regex = /(https?|ftp|file):\/\/\S+|www\.\S+|\S+\.\S+/;
// 		const containsUrl = regex.test(body.text as string);

// 		if (!containsUrl) {
// 			body.disable_web_page_preview = true;
// 		}

// 		if (additionalFields.appendAttribution) {
// 			if (additionalFields.parse_mode === 'Markdown') {
// 				body.text = `${body.text}\n\n_${attributionText}_[n8n](${link})`;
// 			} else if (additionalFields.parse_mode === 'HTML') {
// 				body.text = `${body.text}\n\n<em>${attributionText}</em><a href="${link}" target="_blank">n8n</a>`;
// 			}
// 		}

// 		if (
// 			nodeVersion &&
// 			nodeVersion >= 1.2 &&
// 			additionalFields.disable_web_page_preview === undefined
// 		) {
// 			body.disable_web_page_preview = true;
// 		}

// 		delete additionalFields.appendAttribution;
// 	}

// 	Object.assign(body, additionalFields);

// 	// Add the reply markup
// 	let replyMarkupOption = '';
// 	if (operation !== 'sendMediaGroup') {
// 		replyMarkupOption = this.getNodeParameter('replyMarkup', index) as string;
// 		if (replyMarkupOption === 'none') {
// 			return;
// 		}
// 	}

// 	body.reply_markup = {} as
// 		| IMarkupForceReply
// 		| IMarkupReplyKeyboardRemove
// 		| ITelegramInlineReply
// 		| ITelegramReplyKeyboard;
// 	if (['inlineKeyboard', 'replyKeyboard'].includes(replyMarkupOption)) {
// 		let setParameterName = 'inline_keyboard';
// 		if (replyMarkupOption === 'replyKeyboard') {
// 			setParameterName = 'keyboard';
// 		}

// 		const keyboardData = this.getNodeParameter(replyMarkupOption, index) as IMarkupKeyboard;

// 		// @ts-ignore
// 		(body.reply_markup as ITelegramInlineReply | ITelegramReplyKeyboard)[setParameterName] =
// 			[] as ITelegramKeyboardButton[][];
// 		let sendButtonData: ITelegramKeyboardButton;
// 		if (keyboardData.rows !== undefined) {
// 			for (const row of keyboardData.rows) {
// 				const sendRows: ITelegramKeyboardButton[] = [];
// 				if (row.row?.buttons === undefined) {
// 					continue;
// 				}
// 				for (const button of row.row.buttons) {
// 					sendButtonData = {};
// 					sendButtonData.text = button.text;
// 					if (button.additionalFields) {
// 						Object.assign(sendButtonData, button.additionalFields);
// 					}
// 					sendRows.push(sendButtonData);
// 				}

// 				// @ts-ignore
// 				const array = (body.reply_markup as ITelegramInlineReply | ITelegramReplyKeyboard)[
// 					setParameterName
// 				] as ITelegramKeyboardButton[][];
// 				array.push(sendRows);
// 			}
// 		}
// 	} else if (replyMarkupOption === 'forceReply') {
// 		const forceReply = this.getNodeParameter('forceReply', index) as IMarkupForceReply;
// 		body.reply_markup = forceReply;
// 	} else if (replyMarkupOption === 'replyKeyboardRemove') {
// 		const forceReply = this.getNodeParameter(
// 			'replyKeyboardRemove',
// 			index,
// 		) as IMarkupReplyKeyboardRemove;
// 		body.reply_markup = forceReply;
// 	}

// 	if (replyMarkupOption === 'replyKeyboard') {
// 		const replyKeyboardOptions = this.getNodeParameter(
// 			'replyKeyboardOptions',
// 			index,
// 		) as IMarkupReplyKeyboardOptions;
// 		Object.assign(body.reply_markup, replyKeyboardOptions);
// 	}
// }

/**
 * Make an API request to Dfir Iris
 *
 */
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


// custom load options
export async function getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'case/users/list';

	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	responseData.data.filter( (x: any) => x.user_active).forEach( (row: any) => {
		returnData.push({
			name: `${row.user_name} ( ${row.user_email} )`,
			value: row.user_id,
		});
	})
	// for (const data of responseData.data) {
	// 	returnData.push({
	// 		name: `${data.user_name} ( ${data.user_email} )`,
	// 		value: data.user_id,
	// 	});
	// }

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getIOCTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/ioc-types/list';
	this.logger.verbose("iris > loadOptions > getIOCTypes called")

	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	for (const data of responseData.data) {
		returnData.push({
			name: `${data.type_description} ( ${data.type_name} )`,
			value: data.type_id,
		});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

// export function getImageBySize(photos: IDataObject[], size: string): IDataObject | undefined {
// 	const sizes = {
// 		small: 0,
// 		medium: 1,
// 		large: 2,
// 		extraLarge: 3,
// 	} as IDataObject;

// 	const index = sizes[size] as number;

// 	return photos[index];
// }

// export function getPropertyName(operation: string) {
// 	return operation.replace('send', '').toLowerCase();
// }

// export function getSecretToken(this: IHookFunctions | IWebhookFunctions) {
// 	// Only characters A-Z, a-z, 0-9, _ and - are allowed.
// 	const secret_token = `${this.getWorkflow().id}_${this.getNode().id}`;
// 	return secret_token.replace(/[^a-zA-Z0-9\_\-]+/g, '');
// }

import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
} from 'n8n-workflow';
// import { VersionedNodeType } from 'n8n-workflow';

import {
	NodeConnectionType,
	// NodeOperationError,
	// BINARY_ENCODING
} from 'n8n-workflow';

import {
	addAdditionalFields,
	apiRequest,
	fieldsRemover,
	// returnRaw,
	fieldProperties,
	// getPropertyName
} from './GenericFunctions';

import {
	returnRaw,
	noteFields,
	noteFieldsShort,
	// returnAllOrLimit,
} from './types';

// import { DfirIrisV2 } from './v2/DfirIrisV2.node';

export class DfirIris implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DFIR IRIS',
		name: 'dfirIris',
		icon: 'file:iris.svg',
		group: ['output'],
		version: [1, 1.1],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'works with DFIR IRIS IRP',
		defaults: {
			name: 'DFIR IRIS',
		},
		// usableAsTool: true,
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'dfirIrisApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					// {
					// 	name: 'Alert',
					// 	value: 'alert',
					// },
					// {
					// 	name: 'Asset',
					// 	value: 'asset',
					// },
					// {
					// 	name: 'Case',
					// 	value: 'case',
					// },
					// {
					// 	name: 'Datastore',
					// 	value: 'datastore',
					// },
					{
						name: 'Note',
						value: 'note',
					},
					{
						name: 'Note Group',
						value: 'noteGroup',
					},
					// {
					// 	name: 'Task',
					// 	value: 'task',
					// },
				],
				default: 'note',
			},

			// ----------------------------------
			//         note
			// ----------------------------------

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['note'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'get a note',
						action: 'Get a note',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get multiple notes',
						action: 'Get multiple notes',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create new note',
						action: 'Create new note',
					},
					{
						name: 'Search in Notes',
						value: 'search',
						description: 'Search across notes',
						action: 'Search across notes',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a note',
						action: 'Update a note',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a note',
						action: 'Delete a note',
					},
				],
				default: 'getMany',
			},

			// ----------------------------------
			//         case / Id
			// ----------------------------------

			{
				displayName: 'Case Id',
				name: 'cid',
				type: 'number',
				default: 1,
				displayOptions: {
					show: {
						operation: [
							'get',
							'getMany',
							'create',
							'update',
							'delete',
							'search',
						],
						resource: ['note'],
					},
				},
				required: true,
				description:
					'Case Id',
			},

			// ----------------------------------
			//         note:get
			// ----------------------------------

			{
				displayName: 'Note Id',
				name: 'noteId',
				type: 'number',
				default: '',
				displayOptions: {
					show: {
						operation: [
							'get',
							'update',
							'delete'
						],
						resource: ['note'],
					},
				},
				required: true,
				description:
					'Note Id',
			},

			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						operation: ['get'],
						resource: ['note'],
					},
				},
				default: {},
				options: [
					...returnRaw,
					...fieldProperties(noteFields),
				],
			},

			// ----------------------------------
			//         note:create/update
			// ----------------------------------

			{
				displayName: 'Note Title',
				name: 'title',
				type: 'string',
				default: 'Unnamed',
				displayOptions: {
					show: {
						operation: [
							'create',
							'update',
						],
						resource: ['note'],
					},
				},
				required: true,
				description:
					'Note Title',
			},
			{
				displayName: 'Note Content',
				name: 'content',
				type: 'string',
				default: 'No Content',
				displayOptions: {
					show: {
						operation: [
							'create',
							'update',
						],
						resource: ['note'],
					},
				},
				required: true,
				description:
					'Note Content',
			},

			// ----------------------------------
			//         note:create
			// ----------------------------------

			{
				displayName: 'Note Group Id',
				name: 'directoryId',
				type: 'number',
				default: '',
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: ['note'],
					},
				},
				required: true,
				description:
					'Note Group Id',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['note'],
					},
				},
				default: {},
				options: [
					...returnRaw,
					...fieldProperties(noteFieldsShort),
				],
			},

			// ----------------------------------
			//         note:update
			// ----------------------------------

			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						operation: ['update'],
						resource: ['note'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Note Group Id',
						name: 'parent_id',
						type: 'number',
						// typeOptions: {
						// 	minValue: 0,
						// },
						default: 0,
						description: 'Note Group Id',
					},
					{
						displayName: 'Custom Attributes',
						name: 'custom_attributes',
						type: 'json',
						// typeOptions: {
						// 	minValue: 0,
						// },
						default: 0,
						description: 'Add custom attributes',
					},
					...returnRaw,
					...fieldProperties(noteFieldsShort),
				],
			},

			// ----------------------------------
			//         note:search
			// ----------------------------------

			{
				displayName: 'Search Input',
				name: 'search',
				type: 'string',
				description: 'Use a % as wildcard',
				displayOptions: {
					show: {
						operation: ['search'],
						resource: ['note'],
					},
				},
				default: "",
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						operation: ['search'],
						resource: ['note'],
					},
				},
				default: {},
				options: [
					...returnRaw,
					...fieldProperties(noteFields),
				],
			},
		]
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// For Post
		let body: IDataObject;
		// For Query string
		let qs: IDataObject;

		let requestMethod: IHttpRequestMethods;
		let endpoint: string;

		const operation = this.getNodeParameter('operation', 0);
		const resource = this.getNodeParameter('resource', 0);
		const binaryData = this.getNodeParameter('binaryData', 0, false);

		// const nodeVersion = this.getNode().typeVersion;
		// const instanceId = this.getInstanceId();

		for (let i = 0; i < items.length; i++) {
			try {
				// Reset all values
				requestMethod = 'POST';
				endpoint = '';
				body = {};
				qs = {
					cid: this.getNodeParameter('cid', i) as number
				};

				// let paging = false

				if (resource === 'note') {
					if (operation === 'get') {
						// ----------------------------------
						//         note:get
						// ----------------------------------
						requestMethod = 'GET'
						endpoint = 'case/notes/' + this.getNodeParameter('noteId', i) as string;
					} else if (operation === 'getMany') {
						// -----------------------------------------------
						//         note:getMany
						// -----------------------------------------------
						requestMethod = 'GET'
						endpoint = 'case/notes/directories/filter';
					} else if (operation === 'create') {
						// -----------------------------------------------
						//         note:create
						// -----------------------------------------------

						endpoint = 'case/notes/add';
						body.note_title = this.getNodeParameter('title', i) as string;
						body.note_content = this.getNodeParameter('content', i) as string;
						body.directory_id = this.getNodeParameter('directoryId', i) as string;
					} else if (operation === 'update') {
						// -----------------------------------------------
						//         note:update
						// -----------------------------------------------

						endpoint = 'case/notes/update/' + this.getNodeParameter('noteTd', i) as string;
						body.note_title = this.getNodeParameter('title', i) as string;
						body.note_content = this.getNodeParameter('content', i) as string;

						addAdditionalFields.call(this, body, i)
					} else if (operation === 'delete') {
						// -----------------------------------------------
						//         note:delete
						// -----------------------------------------------

						endpoint = 'case/notes/delete/' + this.getNodeParameter('noteTd', i) as string;
					} else if (operation === 'search') {
						// -----------------------------------------------
						//         note:search
						// -----------------------------------------------
						requestMethod = 'GET'
						endpoint = 'case/notes/search';
						qs.search_input = this.getNodeParameter('search', i) as string;
					}
				}
				// else if (resource === 'chat') {
				// 	if (operation === 'get') {
				// 		// ----------------------------------
				// 		//         chat:get
				// 		// ----------------------------------

				// 		endpoint = 'getChat';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 	} else if (operation === 'administrators') {
				// 		// ----------------------------------
				// 		//         chat:administrators
				// 		// ----------------------------------

				// 		endpoint = 'getChatAdministrators';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 	} else if (operation === 'leave') {
				// 		// ----------------------------------
				// 		//         chat:leave
				// 		// ----------------------------------

				// 		endpoint = 'leaveChat';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 	} else if (operation === 'member') {
				// 		// ----------------------------------
				// 		//         chat:member
				// 		// ----------------------------------

				// 		endpoint = 'getChatMember';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.user_id = this.getNodeParameter('userId', i) as string;
				// 	} else if (operation === 'setDescription') {
				// 		// ----------------------------------
				// 		//         chat:setDescription
				// 		// ----------------------------------

				// 		endpoint = 'setChatDescription';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.description = this.getNodeParameter('description', i) as string;
				// 	} else if (operation === 'setTitle') {
				// 		// ----------------------------------
				// 		//         chat:setTitle
				// 		// ----------------------------------

				// 		endpoint = 'setChatTitle';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.title = this.getNodeParameter('title', i) as string;
				// 	}
				// 	// } else if (resource === 'bot') {
				// 	// 	if (operation === 'info') {
				// 	// 		endpoint = 'getUpdates';
				// 	// 	}
				// } else if (resource === 'file') {
				// 	if (operation === 'get') {
				// 		// ----------------------------------
				// 		//         file:get
				// 		// ----------------------------------

				// 		endpoint = 'getFile';

				// 		body.file_id = this.getNodeParameter('fileId', i) as string;
				// 	}
				// } else if (resource === 'message') {
				// 	if (operation === 'editMessageText') {
				// 		// ----------------------------------
				// 		//         message:editMessageText
				// 		// ----------------------------------

				// 		endpoint = 'editMessageText';

				// 		const messageType = this.getNodeParameter('messageType', i) as string;

				// 		if (messageType === 'inlineMessage') {
				// 			body.inline_message_id = this.getNodeParameter('inlineMessageId', i) as string;
				// 		} else {
				// 			body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 			body.message_id = this.getNodeParameter('messageId', i) as string;
				// 		}

				// 		body.text = this.getNodeParameter('text', i) as string;

				// 		// Add additional fields and replyMarkup
				// 		addAdditionalFields.call(this, body, i);
				// 	} else if (operation === 'deleteMessage') {
				// 		// ----------------------------------
				// 		//       message:deleteMessage
				// 		// ----------------------------------

				// 		endpoint = 'deleteMessage';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.message_id = this.getNodeParameter('messageId', i) as string;
				// 	} else if (operation === 'pinChatMessage') {
				// 		// ----------------------------------
				// 		//        message:pinChatMessage
				// 		// ----------------------------------

				// 		endpoint = 'pinChatMessage';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.message_id = this.getNodeParameter('messageId', i) as string;

				// 		const { disable_notification } = this.getNodeParameter('additionalFields', i);
				// 		if (disable_notification) {
				// 			body.disable_notification = true;
				// 		}
				// 	} else if (operation === 'unpinChatMessage') {
				// 		// ----------------------------------
				// 		//        message:unpinChatMessage
				// 		// ----------------------------------

				// 		endpoint = 'unpinChatMessage';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.message_id = this.getNodeParameter('messageId', i) as string;
				// 	} else if (operation === 'sendAnimation') {
				// 		// ----------------------------------
				// 		//         message:sendAnimation
				// 		// ----------------------------------

				// 		endpoint = 'sendAnimation';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.animation = this.getNodeParameter('file', i, '') as string;

				// 		// Add additional fields and replyMarkup
				// 		addAdditionalFields.call(this, body, i);
				// 	} else if (operation === 'sendAudio') {
				// 		// ----------------------------------
				// 		//         message:sendAudio
				// 		// ----------------------------------

				// 		endpoint = 'sendAudio';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.audio = this.getNodeParameter('file', i, '') as string;

				// 		// Add additional fields and replyMarkup
				// 		addAdditionalFields.call(this, body, i);
				// 	} else if (operation === 'sendChatAction') {
				// 		// ----------------------------------
				// 		//         message:sendChatAction
				// 		// ----------------------------------

				// 		endpoint = 'sendChatAction';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.action = this.getNodeParameter('action', i) as string;
				// 	} else if (operation === 'sendDocument') {
				// 		// ----------------------------------
				// 		//         message:sendDocument
				// 		// ----------------------------------

				// 		endpoint = 'sendDocument';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.document = this.getNodeParameter('file', i, '') as string;

				// 		// Add additional fields and replyMarkup
				// 		addAdditionalFields.call(this, body, i);
				// 	} else if (operation === 'sendLocation') {
				// 		// ----------------------------------
				// 		//         message:sendLocation
				// 		// ----------------------------------

				// 		endpoint = 'sendLocation';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.latitude = this.getNodeParameter('latitude', i) as string;
				// 		body.longitude = this.getNodeParameter('longitude', i) as string;

				// 		// Add additional fields and replyMarkup
				// 		addAdditionalFields.call(this, body, i);
				// 	} else if (operation === 'sendMessage') {
				// 		// ----------------------------------
				// 		//         message:sendMessage
				// 		// ----------------------------------

				// 		endpoint = 'sendMessage';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.text = this.getNodeParameter('text', i) as string;

				// 		// Add additional fields and replyMarkup
				// 		addAdditionalFields.call(this, body, i, nodeVersion, instanceId);
				// 	} else if (operation === 'sendMediaGroup') {
				// 		// ----------------------------------
				// 		//         message:sendMediaGroup
				// 		// ----------------------------------

				// 		endpoint = 'sendMediaGroup';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;

				// 		const additionalFields = this.getNodeParameter('additionalFields', i);
				// 		Object.assign(body, additionalFields);

				// 		const mediaItems = this.getNodeParameter('media', i) as IDataObject;
				// 		body.media = [];
				// 		for (const mediaItem of mediaItems.media as IDataObject[]) {
				// 			if (mediaItem.additionalFields !== undefined) {
				// 				Object.assign(mediaItem, mediaItem.additionalFields);
				// 				delete mediaItem.additionalFields;
				// 			}
				// 			(body.media as IDataObject[]).push(mediaItem);
				// 		}
				// 	} else if (operation === 'sendPhoto') {
				// 		// ----------------------------------
				// 		//         message:sendPhoto
				// 		// ----------------------------------

				// 		endpoint = 'sendPhoto';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.photo = this.getNodeParameter('file', i, '') as string;

				// 		// Add additional fields and replyMarkup
				// 		addAdditionalFields.call(this, body, i);
				// 	} else if (operation === 'sendSticker') {
				// 		// ----------------------------------
				// 		//         message:sendSticker
				// 		// ----------------------------------

				// 		endpoint = 'sendSticker';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.sticker = this.getNodeParameter('file', i, '') as string;

				// 		// Add additional fields and replyMarkup
				// 		addAdditionalFields.call(this, body, i);
				// 	} else if (operation === 'sendVideo') {
				// 		// ----------------------------------
				// 		//         message:sendVideo
				// 		// ----------------------------------

				// 		endpoint = 'sendVideo';

				// 		body.chat_id = this.getNodeParameter('chatId', i) as string;
				// 		body.video = this.getNodeParameter('file', i, '') as string;

				// 		// Add additional fields and replyMarkup
				// 		addAdditionalFields.call(this, body, i);
				// 	}
				// } else {
				// 	throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`, {
				// 		itemIndex: i,
				// 	});
				// }

				let responseData;
				// let filterString: string

				if (binaryData) {
					// const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0);
					// const itemBinaryData = items[i].binary![binaryPropertyName];
					// const propertyName = getPropertyName(operation);
					// const fileName = this.getNodeParameter('additionalFields.fileName', 0, '') as string;

					// const filename = fileName || itemBinaryData.fileName?.toString();

					// if (!fileName && !itemBinaryData.fileName) {
					// 	throw new NodeOperationError(
					// 		this.getNode(),
					// 		`File name is needed to ${operation}. Make sure the property that holds the binary data
					// 	has the file name property set or set it manually in the node using the File Name parameter under
					// 	Additional Fields.`,
					// 	);
					// }

					// body.disable_notification = body.disable_notification?.toString() || 'false';

					// let uploadData: Buffer | Readable;
					// if (itemBinaryData.id) {
					// 	uploadData = await this.helpers.getBinaryStream(itemBinaryData.id);
					// } else {
					// 	uploadData = Buffer.from(itemBinaryData.data, BINARY_ENCODING);
					// }

					// const formData = {
					// 	...body,
					// 	[propertyName]: {
					// 		value: uploadData,
					// 		options: {
					// 			filename,
					// 			contentType: itemBinaryData.mimeType,
					// 		},
					// 	},
					// };

					// responseData = await apiRequest.call(this, requestMethod, endpoint, {}, qs, { formData });
				} else {
					responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);

					const additionalFields = this.getNodeParameter('additionalFields', i, {});
					// const returnAll = this.getNodeParameter('returnAll', i, false);
					// const limit = this.getNodeParameter('limit', i, 100);
					let isRaw = false

					if (additionalFields.hasOwnProperty('isRaw'))
						isRaw = additionalFields.isRaw as boolean

					// field remover
					if (additionalFields.hasOwnProperty('fields')){
						// console.log('responseData[1]', responseData)
						responseData = fieldsRemover(responseData, additionalFields)
						// console.log('responseData[2]', responseData)
					}
					if (!isRaw)
						responseData = responseData.data
				}

				// if (resource === 'file' && operation === 'get') {
				// 	if (this.getNodeParameter('download', i, false)) {
				// 		const filePath = responseData.result.file_path;

				// 		const credentials = await this.getCredentials('telegramApi');
				// 		const file = await apiRequest.call(
				// 			this,
				// 			'GET',
				// 			'',
				// 			{},
				// 			{},
				// 			{
				// 				json: false,
				// 				encoding: null,
				// 				uri: `${credentials.baseUrl}/file/bot${credentials.accessToken}/${filePath}`,
				// 				resolveWithFullResponse: true,
				// 				useStream: true,
				// 			},
				// 		);

				// 		const fileName = filePath.split('/').pop();

				// 		const data = await this.helpers.prepareBinaryData(
				// 			file.body as Buffer,
				// 			fileName as string,
				// 		);

				// 		returnData.push({
				// 			json: responseData,
				// 			binary: { data },
				// 			pairedItem: { item: i },
				// 		});
				// 		continue;
				// 	}
				// } else if (resource === 'chat' && operation === 'administrators') {
				// 	const executionData = this.helpers.constructExecutionMetaData(
				// 		this.helpers.returnJsonArray(responseData.result as IDataObject[]),
				// 		{ itemData: { item: i } },
				// 	);
				// 	returnData.push(...executionData);
				// 	continue;
				// }

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: {}, error: error.message });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

}

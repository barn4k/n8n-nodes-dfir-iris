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
	NodeOperationError,
	// BINARY_ENCODING
} from 'n8n-workflow';

import {
	addAdditionalFields,
	apiRequest,
	getUsers,
	fieldsRemover,
	// returnRaw,
	// fieldProperties,
	// getPropertyName
} from './GenericFunctions';


// import {
// 	returnRaw,
// 	// noteFields,
// 	// noteFieldsShort,
// 	// returnAllOrLimit,
// } from './types';

import { noteFields, noteTypeFields, } from './NoteResource'
import { taskFields, taskTypeFields, } from './TaskResource'

export class DfirIris implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DFIR IRIS',
		name: 'dfirIris',
		icon: 'file:iris.svg',
		group: ['output'],
		version: [1, 1.1],
		subtitle: '={{ $parameter["resource"] + ": " + $parameter["operation"] }}',
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
						name: 'Task',
						value: 'task',
					},
					// {
					// 	name: 'Comment',
					// 	value: 'comment',
					// },
				],
				default: 'note',
			},
			// ----------------------------------
			//         global params
			// ----------------------------------

			...noteFields,
			...taskFields,

			{
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
				description:
					'Case Id',
			},

			...noteTypeFields,
			...taskTypeFields,
		]

	}
	methods = {
		loadOptions: {
			getUsers,
		}
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
				let endpointBase = ''
				let isRaw = false

				if (resource === 'note') {
					endpointBase = 'case/notes'
					if (operation === 'get') {
						// ----------------------------------
						//         note:get
						// ----------------------------------
						requestMethod = 'GET'
						endpoint = `${endpointBase}/` + this.getNodeParameter('noteId', i) as string;
					} else if (operation === 'getMany') {
						// -----------------------------------------------
						//         note:getMany
						// -----------------------------------------------
						requestMethod = 'GET'
						endpoint = `${endpointBase}/directories/filter`;
					} else if (operation === 'create') {
						// -----------------------------------------------
						//         note:create
						// -----------------------------------------------

						endpoint = `${endpointBase}/add`;
						body.note_title = this.getNodeParameter('title', i) as string;
						body.note_content = this.getNodeParameter('content', i) as string;
						body.directory_id = this.getNodeParameter('directoryId', i) as string;

					} else if (operation === 'addNoteGroup') {
						// -----------------------------------------------
						//         note:addNoteGroup
						// -----------------------------------------------

						endpoint = `${endpointBase}/directories/add`;
						body.name = this.getNodeParameter('directoryName', i) as string;
						addAdditionalFields.call(this, body, i)
					} else if (operation === 'update') {
						// -----------------------------------------------
						//         note:update
						// -----------------------------------------------

						endpoint = `${endpointBase}/update/` + this.getNodeParameter('noteId', i) as string;
						body.note_title = this.getNodeParameter('title', i) as string;
						body.note_content = this.getNodeParameter('content', i) as string;

						addAdditionalFields.call(this, body, i)
					} else if (operation === 'delete') {
						// -----------------------------------------------
						//         note:delete
						// -----------------------------------------------

						endpoint = `${endpointBase}/delete/` + this.getNodeParameter('noteId', i) as string;
						isRaw = true
					} else if (operation === 'deleteNoteGroup') {
						// -----------------------------------------------
						//         note:deleteNoteGroup
						// -----------------------------------------------

						endpoint = `${endpointBase}/directories/delete/` + this.getNodeParameter('directoryId', i) as string;
						isRaw = true
					} else if (operation === 'search') {
						// -----------------------------------------------
						//         note:search
						// -----------------------------------------------
						requestMethod = 'GET'
						endpoint = `${endpointBase}/search`;
						qs.search_input = this.getNodeParameter('search', i) as string;
					}
				}
				else if (resource === 'task') {
					endpointBase = 'case/tasks'
					if (operation === 'get') {
						// ----------------------------------
						//         task:get
						// ----------------------------------
						requestMethod = 'GET'
						endpoint = `${endpointBase}/` + this.getNodeParameter('taskId', i) as string;
					} else if (operation === 'getMany') {
						// -----------------------------------------------
						//         task:getMany
						// -----------------------------------------------
						requestMethod = 'GET'
						endpoint = `${endpointBase}/list`;
					} else if (operation === 'create') {
						// -----------------------------------------------
						//         task:create
						// -----------------------------------------------

						endpoint = `${endpointBase}/add`;
						body.task_title = this.getNodeParameter('title', i) as string;
						body.task_assignees_id = [this.getNodeParameter('assignee', i) as number];
						body.task_status_id = this.getNodeParameter('status', i) as number;
						addAdditionalFields.call(this, body, i)
					} else if (operation === 'update') {
						// -----------------------------------------------
						//         task:update
						// -----------------------------------------------

						endpoint = `${endpointBase}/update/` + this.getNodeParameter('taskId', i) as string;
						body.task_title = this.getNodeParameter('title', i) as string;
						body.task_assignees_id = [this.getNodeParameter('assignee', i) as number];
						body.task_status_id = this.getNodeParameter('status', i) as number;
						addAdditionalFields.call(this, body, i)
					} else if (operation === 'delete') {
						// -----------------------------------------------
						//         task:delete
						// -----------------------------------------------

						endpoint = `${endpointBase}/delete/` + this.getNodeParameter('taskId', i) as string;
						isRaw = true
					}
				}
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
				else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`, {
						itemIndex: i,
					});
				}

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
					this.logger.debug('responseData', responseData)

					const additionalFields = this.getNodeParameter('additionalFields', i, {});

					if (additionalFields.hasOwnProperty('isRaw'))
						isRaw = additionalFields.isRaw as boolean

					// field remover
					if (additionalFields.hasOwnProperty('fields')){
						responseData = fieldsRemover(responseData, additionalFields)
					}
					if (!isRaw)
						if (resource === 'task' && operation === 'getMany')
							responseData = responseData.data.tasks
						else
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

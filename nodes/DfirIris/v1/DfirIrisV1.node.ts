import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodeTypeBaseDescription,
	IHttpRequestMethods,
} from 'n8n-workflow';
// import { VersionedNodeType } from 'n8n-workflow';

import {
	NodeOperationError,
	// BINARY_ENCODING
} from 'n8n-workflow';

import { versionDescription } from './actions/versionDescription';
// import { router } from './actions/router';
import { loadOptions } from './methods';
import { utils } from './helpers'

import { apiRequest } from './transport';

export class DfirIrisV1 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...versionDescription,
		};
	}

	methods = {
		loadOptions,
	};

	// async execute(this: IExecuteFunctions) {
	// 	return await router.call(this);
	// }

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
						utils.addAdditionalFields.call(this, body, i)
					} else if (operation === 'update') {
						// -----------------------------------------------
						//         note:update
						// -----------------------------------------------

						endpoint = `${endpointBase}/update/` + this.getNodeParameter('noteId', i) as string;
						body.note_title = this.getNodeParameter('title', i) as string;
						body.note_content = this.getNodeParameter('content', i) as string;

						utils.addAdditionalFields.call(this, body, i)
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
						utils.addAdditionalFields.call(this, body, i)
					} else if (operation === 'update') {
						// -----------------------------------------------
						//         task:update
						// -----------------------------------------------

						endpoint = `${endpointBase}/update/` + this.getNodeParameter('taskId', i) as string;
						body.task_title = this.getNodeParameter('title', i) as string;
						body.task_assignees_id = [this.getNodeParameter('assignee', i) as number];
						body.task_status_id = this.getNodeParameter('status', i) as number;
						utils.addAdditionalFields.call(this, body, i)
					} else if (operation === 'delete') {
						// -----------------------------------------------
						//         task:delete
						// -----------------------------------------------

						endpoint = `${endpointBase}/delete/` + this.getNodeParameter('taskId', i) as string;
						isRaw = true
					}
				}
				else if (resource === 'comment') {
					endpointBase =
						'case/' +
						this.getNodeParameter('objectName', i) as string +
						'/' +
						this.getNodeParameter('objectId', i) as string;
					if (operation === 'getMany') {
						// -----------------------------------------------
						//         comment:getMany
						// -----------------------------------------------
						requestMethod = 'GET'
						endpoint = `${endpointBase}/comments/list`;
						utils.addAdditionalFields.call(this, body, i)
					} else if (operation === 'create') {
						// -----------------------------------------------
						//         comment:create
						// -----------------------------------------------

						endpoint = `${endpointBase}/comments/add`;
						utils.addAdditionalFields.call(this, body, i)
					} else if (operation === 'update') {
						// -----------------------------------------------
						//         comment:update
						// -----------------------------------------------

						endpoint = `${endpointBase}/comments/` + this.getNodeParameter('commentId', i) as string + '/edit';
						utils.addAdditionalFields.call(this, body, i)
					} else if (operation === 'delete') {
						// -----------------------------------------------
						//         comment:delete
						// -----------------------------------------------

						endpoint = `${endpointBase}/comments/` + this.getNodeParameter('commentId', i) as string + '/delete';
						isRaw = true
					}
				}
				else if (resource === 'asset') {
					endpointBase = 'case/assets'
					if (operation === 'get') {
						// ----------------------------------
						//         asset:get
						// ----------------------------------
						requestMethod = 'GET'
						endpoint = `${endpointBase}/` + this.getNodeParameter('assetId', i) as string;
					} else if (operation === 'getMany') {
						// -----------------------------------------------
						//         asset:getMany
						// -----------------------------------------------
						requestMethod = 'GET'
						endpoint = `${endpointBase}/list`;
					} else if (operation === 'create') {
						// -----------------------------------------------
						//         asset:create
						// -----------------------------------------------

						endpoint = `${endpointBase}/add`;
						body.asset_type_id = this.getNodeParameter('assetType', i) as number;
						body.asset_name = this.getNodeParameter('assetName', i) as string;
						utils.addAdditionalFields.call(this, body, i)
					} else if (operation === 'update') {
						// -----------------------------------------------
						//         asset:update
						// -----------------------------------------------

						endpoint = `${endpointBase}/update/` + this.getNodeParameter('assetId', i) as string;
						body.asset_type_id = this.getNodeParameter('assetType', i) as number;
						body.asset_name = this.getNodeParameter('assetName', i) as string;
						utils.addAdditionalFields.call(this, body, i)
					} else if (operation === 'delete') {
						// -----------------------------------------------
						//         asset:delete
						// -----------------------------------------------

						endpoint = `${endpointBase}/delete/` + this.getNodeParameter('assetId', i) as string;
						isRaw = true
					}
				}
				else if (resource === 'ioc') {
					endpointBase = 'case/ioc'
					if (operation === 'get') {
						// ----------------------------------
						//         ioc:get
						// ----------------------------------
						requestMethod = 'GET'
						endpoint = `${endpointBase}/` + this.getNodeParameter('iocId', i) as string;
					} else if (operation === 'getMany') {
						// -----------------------------------------------
						//         ioc:getMany
						// -----------------------------------------------
						requestMethod = 'GET'
						endpoint = `${endpointBase}/list`;
					} else if (operation === 'create') {
						// -----------------------------------------------
						//         ioc:create
						// -----------------------------------------------

						endpoint = `${endpointBase}/add`;
						body.ioc_type_id = this.getNodeParameter('type', i) as number;
						body.ioc_tlp_id = this.getNodeParameter('tlpId', i) as string;
						body.ioc_value = this.getNodeParameter('value', i) as string;
						body.ioc_description = this.getNodeParameter('description', i) as string;
						body.ioc_tags = this.getNodeParameter('tags', i) as string;
						utils.addAdditionalFields.call(this, body, i)
					} else if (operation === 'update') {
						// -----------------------------------------------
						//         ioc:update
						// -----------------------------------------------

						endpoint = `${endpointBase}/update/` + this.getNodeParameter('iocId', i) as string;
						body.ioc_type_id = this.getNodeParameter('type', i) as number;
						body.ioc_tlp_id = this.getNodeParameter('tlpId', i) as string;
						body.ioc_value = this.getNodeParameter('value', i) as string;
						body.ioc_description = this.getNodeParameter('description', i) as string;
						body.ioc_tags = this.getNodeParameter('tags', i) as string;
						utils.addAdditionalFields.call(this, body, i)
					} else if (operation === 'delete') {
						// -----------------------------------------------
						//         ioc:delete
						// -----------------------------------------------

						endpoint = `${endpointBase}/delete/` + this.getNodeParameter('iocId', i) as string;
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

					const options = this.getNodeParameter('options', i, {});

					if (options.hasOwnProperty('isRaw'))
						isRaw = options.isRaw as boolean

					// field remover
					if (options.hasOwnProperty('fields')){
						responseData = utils.fieldsRemover(responseData, options)
					}
					if (!isRaw)
						if (resource === 'task' && operation === 'getMany')
							responseData = responseData.data.tasks
						if (resource === 'ioc' && operation === 'getMany')
							responseData = responseData.data.ioc
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

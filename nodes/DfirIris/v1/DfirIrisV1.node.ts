import type {
	IExecuteFunctions,
	// IDataObject,
	// INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodeTypeBaseDescription,
	// IHttpRequestMethods,
	// NodeExecutionWithMetadata,
} from 'n8n-workflow';
// import { VersionedNodeType } from 'n8n-workflow';

import { router } from './actions/router';

// import {
// 	NodeOperationError,
// 	BINARY_ENCODING
// } from 'n8n-workflow';

// import FormData from 'form-data';

// import type { Readable } from 'stream';

import { versionDescription } from './actions/versionDescription';
// import { router } from './actions/router';
import { loadOptions } from './methods';
// import { utils } from './helpers'

// import {
// 	apiRequest,
// 	getFolderName
// } from './transport';

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

	async execute(this: IExecuteFunctions) {
		return await router.call(this);
	}

	// async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	// 	const items = this.getInputData();
	// 	const returnData: INodeExecutionData[] = [];

	// 	// For Post
	// 	let body: IDataObject | FormData;
	// 	// For Query string
	// 	let qs: IDataObject;

	// 	let requestMethod: IHttpRequestMethods;
	// 	let endpoint: string;
	// 	let endpointBase: string;
	// 	let isRaw: boolean
	// 	let responseData
	// 	let isFormData: boolean
	// 	let reqOptions: IDataObject

	// 	const operation = this.getNodeParameter('operation', 0);
	// 	const resource = this.getNodeParameter('resource', 0);

	// 	// const nodeVersion = this.getNode().typeVersion;
	// 	// const instanceId = this.getInstanceId();

	// 	for (let i = 0; i < items.length; i++) {
	// 		try {
	// 			// Reset all values
	// 			requestMethod = 'POST';
	// 			endpoint = '';
	// 			body = {};
	// 			qs = {
	// 				cid: this.getNodeParameter('cid', i) as number
	// 			};
	// 			reqOptions = {}

	// 			// let paging = false
	// 			endpointBase = ''
	// 			isRaw = false
	// 			isFormData = false

	// 			if (resource === 'note') {
	// 				endpointBase = 'case/notes'
	// 				if (operation === 'get') {
	// 					// ----------------------------------
	// 					//         note:get
	// 					// ----------------------------------
	// 					requestMethod = 'GET'
	// 					endpoint = `${endpointBase}/` + this.getNodeParameter('noteId', i) as string;
	// 				} else if (operation === 'getMany') {
	// 					// -----------------------------------------------
	// 					//         note:getMany
	// 					// -----------------------------------------------
	// 					requestMethod = 'GET'
	// 					endpoint = `${endpointBase}/directories/filter`;
	// 				} else if (operation === 'create') {
	// 					// -----------------------------------------------
	// 					//         note:create
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/add`;
	// 					body.note_title = this.getNodeParameter('title', i) as string;
	// 					body.note_content = this.getNodeParameter('content', i) as string;
	// 					body.directory_id = this.getNodeParameter('directoryId', i) as string;

	// 				} else if (operation === 'addNoteGroup') {
	// 					// -----------------------------------------------
	// 					//         note:addNoteGroup
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/directories/add`;
	// 					body.name = this.getNodeParameter('directoryName', i) as string;
	// 					utils.addAdditionalFields.call(this, body, i)
	// 				} else if (operation === 'update') {
	// 					// -----------------------------------------------
	// 					//         note:update
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/update/` + this.getNodeParameter('noteId', i) as string;
	// 					body.note_title = this.getNodeParameter('title', i) as string;
	// 					body.note_content = this.getNodeParameter('content', i) as string;

	// 					utils.addAdditionalFields.call(this, body, i)
	// 				} else if (operation === 'delete') {
	// 					// -----------------------------------------------
	// 					//         note:delete
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/delete/` + this.getNodeParameter('noteId', i) as string;
	// 					isRaw = true
	// 				} else if (operation === 'deleteNoteGroup') {
	// 					// -----------------------------------------------
	// 					//         note:deleteNoteGroup
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/directories/delete/` + this.getNodeParameter('directoryId', i) as string;
	// 					isRaw = true
	// 				} else if (operation === 'search') {
	// 					// -----------------------------------------------
	// 					//         note:search
	// 					// -----------------------------------------------
	// 					requestMethod = 'GET'
	// 					endpoint = `${endpointBase}/search`;
	// 					qs.search_input = this.getNodeParameter('search', i) as string;
	// 				}
	// 			}
	// 			else if (resource === 'task') {
	// 				endpointBase = 'case/tasks'
	// 				if (operation === 'get') {
	// 					// ----------------------------------
	// 					//         task:get
	// 					// ----------------------------------
	// 					requestMethod = 'GET'
	// 					endpoint = `${endpointBase}/` + this.getNodeParameter('taskId', i) as string;
	// 				} else if (operation === 'getMany') {
	// 					// -----------------------------------------------
	// 					//         task:getMany
	// 					// -----------------------------------------------
	// 					requestMethod = 'GET'
	// 					endpoint = `${endpointBase}/list`;
	// 				} else if (operation === 'create') {
	// 					// -----------------------------------------------
	// 					//         task:create
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/add`;
	// 					body.task_title = this.getNodeParameter('title', i) as string;
	// 					body.task_assignees_id = [this.getNodeParameter('assignee', i) as number];
	// 					body.task_status_id = this.getNodeParameter('status', i) as number;
	// 					utils.addAdditionalFields.call(this, body, i)
	// 				} else if (operation === 'update') {
	// 					// -----------------------------------------------
	// 					//         task:update
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/update/` + this.getNodeParameter('taskId', i) as string;
	// 					body.task_title = this.getNodeParameter('title', i) as string;
	// 					body.task_assignees_id = [this.getNodeParameter('assignee', i) as number];
	// 					body.task_status_id = this.getNodeParameter('status', i) as number;
	// 					utils.addAdditionalFields.call(this, body, i)
	// 				} else if (operation === 'delete') {
	// 					// -----------------------------------------------
	// 					//         task:delete
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/delete/` + this.getNodeParameter('taskId', i) as string;
	// 					isRaw = true
	// 				}
	// 			}
	// 			else if (resource === 'comment') {
	// 				endpointBase =
	// 					'case/' +
	// 					this.getNodeParameter('objectName', i) as string +
	// 					'/' +
	// 					this.getNodeParameter('objectId', i) as string;
	// 				if (operation === 'getMany') {
	// 					// -----------------------------------------------
	// 					//         comment:getMany
	// 					// -----------------------------------------------
	// 					requestMethod = 'GET'
	// 					endpoint = `${endpointBase}/comments/list`;
	// 					utils.addAdditionalFields.call(this, body, i)
	// 				} else if (operation === 'create') {
	// 					// -----------------------------------------------
	// 					//         comment:create
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/comments/add`;
	// 					utils.addAdditionalFields.call(this, body, i)
	// 				} else if (operation === 'update') {
	// 					// -----------------------------------------------
	// 					//         comment:update
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/comments/` + this.getNodeParameter('commentId', i) as string + '/edit';
	// 					utils.addAdditionalFields.call(this, body, i)
	// 				} else if (operation === 'delete') {
	// 					// -----------------------------------------------
	// 					//         comment:delete
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/comments/` + this.getNodeParameter('commentId', i) as string + '/delete';
	// 					isRaw = true
	// 				}
	// 			}
	// 			else if (resource === 'asset') {
	// 				endpointBase = 'case/assets'
	// 				if (operation === 'get') {
	// 					// ----------------------------------
	// 					//         asset:get
	// 					// ----------------------------------
	// 					requestMethod = 'GET'
	// 					endpoint = `${endpointBase}/` + this.getNodeParameter('assetId', i) as string;
	// 				} else if (operation === 'getMany') {
	// 					// -----------------------------------------------
	// 					//         asset:getMany
	// 					// -----------------------------------------------
	// 					requestMethod = 'GET'
	// 					endpoint = `${endpointBase}/list`;
	// 				} else if (operation === 'create') {
	// 					// -----------------------------------------------
	// 					//         asset:create
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/add`;
	// 					body.asset_type_id = this.getNodeParameter('assetType', i) as number;
	// 					body.asset_name = this.getNodeParameter('assetName', i) as string;
	// 					utils.addAdditionalFields.call(this, body, i)
	// 				} else if (operation === 'update') {
	// 					// -----------------------------------------------
	// 					//         asset:update
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/update/` + this.getNodeParameter('assetId', i) as string;
	// 					body.asset_type_id = this.getNodeParameter('assetType', i) as number;
	// 					body.asset_name = this.getNodeParameter('assetName', i) as string;
	// 					utils.addAdditionalFields.call(this, body, i)
	// 				} else if (operation === 'delete') {
	// 					// -----------------------------------------------
	// 					//         asset:delete
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/delete/` + this.getNodeParameter('assetId', i) as string;
	// 					isRaw = true
	// 				}
	// 			}
	// 			else if (resource === 'ioc') {
	// 				endpointBase = 'case/ioc'
	// 				if (operation === 'get') {
	// 					// ----------------------------------
	// 					//         ioc:get
	// 					// ----------------------------------
	// 					requestMethod = 'GET'
	// 					endpoint = `${endpointBase}/` + this.getNodeParameter('iocId', i) as string;
	// 				} else if (operation === 'getMany') {
	// 					// -----------------------------------------------
	// 					//         ioc:getMany
	// 					// -----------------------------------------------
	// 					requestMethod = 'GET'
	// 					endpoint = `${endpointBase}/list`;
	// 				} else if (operation === 'create') {
	// 					// -----------------------------------------------
	// 					//         ioc:create
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/add`;
	// 					body.ioc_type_id = this.getNodeParameter('type', i) as number;
	// 					body.ioc_tlp_id = this.getNodeParameter('tlpId', i) as string;
	// 					body.ioc_value = this.getNodeParameter('value', i) as string;
	// 					body.ioc_description = this.getNodeParameter('description', i) as string;
	// 					body.ioc_tags = this.getNodeParameter('tags', i) as string;
	// 					utils.addAdditionalFields.call(this, body, i)
	// 				} else if (operation === 'update') {
	// 					// -----------------------------------------------
	// 					//         ioc:update
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/update/` + this.getNodeParameter('iocId', i) as string;
	// 					body.ioc_type_id = this.getNodeParameter('type', i) as number;
	// 					body.ioc_tlp_id = this.getNodeParameter('tlpId', i) as string;
	// 					body.ioc_value = this.getNodeParameter('value', i) as string;
	// 					body.ioc_description = this.getNodeParameter('description', i) as string;
	// 					body.ioc_tags = this.getNodeParameter('tags', i) as string;
	// 					utils.addAdditionalFields.call(this, body, i)
	// 				} else if (operation === 'delete') {
	// 					// -----------------------------------------------
	// 					//         ioc:delete
	// 					// -----------------------------------------------

	// 					endpoint = `${endpointBase}/delete/` + this.getNodeParameter('iocId', i) as string;
	// 					isRaw = true
	// 				}
	// 			}
	// 			else {
	// 				throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`, {
	// 					itemIndex: i,
	// 				});
	// 			}

	// 			responseData = await apiRequest.call(
	// 				this,
	// 				requestMethod,
	// 				endpoint,
	// 				body,
	// 				qs,
	// 				reqOptions,
	// 				isFormData
	// 			);
	// 			this.logger.debug('responseData end', responseData)
	// 			console.debug('responseData end', responseData)

	// 			const options = this.getNodeParameter('options', i, {});
	// 			let executionData: NodeExecutionWithMetadata[]

	// 			if (operation === 'downloadFile'){
	// 				const mimeType = responseData.headers?.['content-type'] ?? undefined
	// 				const fileName = (body as any).fileName || responseData.headers?.['content-disposition'].split('; ').filter( (d: string) => d.indexOf('filename')>=0)[0].replace('filename=', '')
	// 				let item = this.getInputData()[i]
	// 				const newItem: INodeExecutionData = {
	// 					json: item.json,
	// 					binary: {},
	// 				};

	// 				item = newItem;
	// 				const dataPropertyNameDownload = this.getNodeParameter('binaryName',i, 'data') as string;
	// 				item.binary![dataPropertyNameDownload] = await this.helpers.prepareBinaryData(
	// 					responseData.body as Buffer,
	// 					fileName as string,
	// 					mimeType as string,
	// 				);

	// 				executionData = this.helpers.constructExecutionMetaData([item], { itemData: { item: i } });

	// 			} else {
	// 				if (options.hasOwnProperty('isRaw'))
	// 					isRaw = options.isRaw as boolean

	// 				// field remover
	// 				if (options.hasOwnProperty('fields')){
	// 					responseData = utils.fieldsRemover(responseData, options)
	// 				}
	// 				if (!isRaw){
	// 					if (resource === 'task' && operation === 'getMany')
	// 						responseData = responseData.data.tasks
	// 					if (resource === 'ioc' && operation === 'getMany')
	// 						responseData = responseData.data.ioc
	// 					else
	// 						responseData = responseData.data
	// 				}

	// 				executionData = this.helpers.constructExecutionMetaData(
	// 					this.helpers.returnJsonArray(responseData as IDataObject[]),
	// 					{ itemData: { item: i } },
	// 				);
	// 			}
	// 			returnData.push(...executionData);
	// 		} catch (error) {
	// 			if (this.continueOnFail()) {
	// 				returnData.push({ json: {}, error: error.message });
	// 				continue;
	// 			}
	// 			throw error;
	// 		}
	// 	}

	// 	return [returnData];
	// }
}

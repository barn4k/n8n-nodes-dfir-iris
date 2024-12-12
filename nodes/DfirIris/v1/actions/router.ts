import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import type { DfirIrisType } from './node.type';

import * as datastore from './datastore/Datastore.resource';
// import * as file from './file/File.resource';
// import * as fileFolder from './fileFolder/FileFolder.resource';
// import * as folder from './folder/Folder.resource';

// import * as utils from '../helpers/utils'

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	const resource = this.getNodeParameter<DfirIrisType>('resource', 0);
	const operation = this.getNodeParameter('operation', 0);

	const dfirIris = {
		resource,
		operation,
	} as DfirIrisType;

	for (let i = 0; i < items.length; i++) {
		// const options = this.getNodeParameter('options', i, {});
		// const isRaw = options.isRaw as boolean || false

		try {
			switch (dfirIris.resource) {
				case 'datastore':
					returnData.push(...(await datastore[dfirIris.operation].execute.call(this, i)));
					break;
				// case 'file':
				// 	returnData.push(...(await file[googleDrive.operation].execute.call(this, i, items[i])));
				// 	break;
				// case 'fileFolder':
				// 	returnData.push(...(await fileFolder[googleDrive.operation].execute.call(this, i)));
				// 	break;
				// case 'folder':
				// 	returnData.push(...(await folder[googleDrive.operation].execute.call(this, i)));
				// 	break;
				default:
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known`);
			}
			console.debug('returnData');
			console.debug(returnData);
		} catch (error) {
			if (this.continueOnFail()) {
				if (resource === 'datastore' && operation === 'downloadFile') {
					items[i].json = { error: error.message };
				} else {
					returnData.push({ json: { error: error.message } });
				}
				continue;
			}
			throw error;
		}

		// field remover
		// if (options.hasOwnProperty('fields')){
		// 	returnData = utils.fieldsRemover(returnData, options)
		// }
		// if (!isRaw){
		// 	if (resource === 'task' && operation === 'getMany')
		// 		responseData = responseData.data.tasks
		// 	if (resource === 'ioc' && operation === 'getMany')
		// 		responseData = responseData.data.ioc
		// 	else
		// 		responseData = responseData.data
		// }
	}

	return [returnData];
}

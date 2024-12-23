import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import type { DfirIrisType } from './node.type';

import * as datastoreFolder from './datastoreFolder/DatastoreFolder.resource';
import * as datastoreFile from './datastoreFile/DatastoreFile.resource';
import * as asset from './asset/Asset.resource';
import * as ioc from './ioc/IOC.resource';
import * as task from './task/Task.resource';
// import * as note from './note/Note.resource';
import * as noteDirectory from './noteDirectory/NoteDirectory.resource';

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
		try {
			switch (dfirIris.resource) {
				case 'datastoreFile':
					returnData.push(...(await datastoreFile[dfirIris.operation].execute.call(this, i)));
					break;
				case 'datastoreFolder':
					returnData.push(...(await datastoreFolder[dfirIris.operation].execute.call(this, i)));
					break;
				case 'asset':
					returnData.push(...(await asset[dfirIris.operation].execute.call(this, i)));
					break;
				case 'ioc':
					returnData.push(...(await ioc[dfirIris.operation].execute.call(this, i)));
					break;
				case 'task':
					returnData.push(...(await task[dfirIris.operation].execute.call(this, i)));
					break;
				// case 'note':
				// 	returnData.push(...(await note[dfirIris.operation].execute.call(this, i)));
				// 	break;
				case 'noteDirectory':
					returnData.push(...(await noteDirectory[dfirIris.operation].execute.call(this, i)));
					break;
				// case 'file':
				// 	returnData.push(...(await file[googleDrive.operation].execute.call(this, i, items[i])));
				// 	break;
				default:
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known`);
			}
			console.debug('returnData');
			console.debug(returnData);
		} catch (error) {
			if (this.continueOnFail()) {
				if (resource === 'datastoreFile' && operation === 'downloadFile') {
					items[i].json = { error: error.message };
				} else {
					returnData.push({ json: { error: error.message } });
				}
				continue;
			}
			throw error;
		}
	}

	return [returnData];
}

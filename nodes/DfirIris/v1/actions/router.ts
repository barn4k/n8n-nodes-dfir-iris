import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import type { DfirIrisType } from './node.type';

import * as alert from './alert/Alert.resource';
import * as asset from './asset/Asset.resource';
import * as icase from './case/Case.resource';
import * as comment from './comment/Comment.resource';
import * as datastoreFile from './datastoreFile/DatastoreFile.resource';
import * as datastoreFolder from './datastoreFolder/DatastoreFolder.resource';
import * as ioc from './ioc/IOC.resource';
import * as iModule from './module/Module.resource';
import * as note from './note/Note.resource';
import * as noteDirectory from './noteDirectory/NoteDirectory.resource';
import * as task from './task/Task.resource';
import { IrisLog } from '../helpers/utils';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];
	const irisLogger = new IrisLog(this.logger);

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
				case 'module':
					returnData.push(...(await iModule[dfirIris.operation].execute.call(this, i)));
					break;
				case 'note':
					returnData.push(...(await note[dfirIris.operation].execute.call(this, i)));
					break;
				case 'noteDirectory':
					returnData.push(...(await noteDirectory[dfirIris.operation].execute.call(this, i)));
					break;
				case 'comment':
					returnData.push(...(await comment[dfirIris.operation].execute.call(this, i)));
					break;
				case 'case':
					returnData.push(...(await icase[dfirIris.operation].execute.call(this, i)));
					break;
				case 'alert':
					returnData.push(...(await alert[dfirIris.operation].execute.call(this, i)));
					break;
				default:
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known`);
			}

			irisLogger.info('router returnData:', {returnData});
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

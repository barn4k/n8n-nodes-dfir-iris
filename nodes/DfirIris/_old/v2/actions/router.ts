// import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

// import * as alert from './alert';
// // import * as message from './message';
// // import * as reaction from './reaction';
// // import * as user from './user';
// import type { DfirIris } from './Interfaces';

// export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
// 	const items = this.getInputData();
// 	const operationResult: INodeExecutionData[] = [];
// 	let responseData: IDataObject | IDataObject[] = [];
// 	this.logger.verbose("iris > router called")
// 	for (let i = 0; i < items.length; i++) {
// 		const resource = this.getNodeParameter<DfirIris>('resource', i);
// 		let operation = this.getNodeParameter('operation', i);
// 		// if (operation === 'del') {
// 		// 	operation = 'delete';
// 		// }

// 		const iris = {
// 			resource,
// 			operation,
// 		} as DfirIris;

// 		try {
// 			if (iris.resource === 'alert') {
// 				responseData = await alert[iris.operation].execute.call(this, i);
// 			// } else if (iris.resource === 'message') {
// 			// 	responseData = await message[mattermost.operation].execute.call(this, i);
// 			// } else if (iris.resource === 'reaction') {
// 			// 	responseData = await reaction[mattermost.operation].execute.call(this, i);
// 			// } else if (iris.resource === 'user') {
// 			// 	responseData = await user[mattermost.operation].execute.call(this, i);
// 			}

// 			const executionData = this.helpers.constructExecutionMetaData(
// 				this.helpers.returnJsonArray(responseData),
// 				{ itemData: { item: i } },
// 			);
// 			operationResult.push(...executionData);
// 		} catch (err) {
// 			if (this.continueOnFail()) {
// 				operationResult.push({ json: this.getInputData(i)[0].json, error: err });
// 			} else {
// 				if (err.context) err.context.itemIndex = i;
// 				throw err;
// 			}
// 		}
// 	}

// 	return [operationResult];
// }

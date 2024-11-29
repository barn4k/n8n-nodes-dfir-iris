// import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

// import { apiRequest } from '../../../transport';
// import { fieldsRemover } from '../../../methods'

// export async function fetch(
// 	this: IExecuteFunctions,
// 	index: number,
// ): Promise<INodeExecutionData[]> {
// 	const body = {} as IDataObject;
// 	const qs = {} as IDataObject;
// 	const requestMethod = 'GET';
// 	const endpoint = `alerts/${this.getNodeParameter('alertId', index, 1) as number}`;
// 	this.logger.verbose("iris > alert > fetch > execute called")

// 	const options = this.getNodeParameter('options', index, {})
// 	const fieldStr = options.fields as string || ''
// 	const responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);
// 	// console.log('responseData: ', responseData)

// 	const responseDataModified = fieldStr ? fieldsRemover(responseData, fieldStr): responseData

// 	return this.helpers.returnJsonArray(responseDataModified as IDataObject[] || responseData as IDataObject[]);
// }

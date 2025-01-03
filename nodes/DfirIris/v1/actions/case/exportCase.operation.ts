import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { apiRequest } from '../../transport';
import * as icase from './commonDescription';

const properties: INodeProperties[] = [icase.rCaseId];

const displayOptions = {
	show: {
		resource: ['case'],
		operation: ['exportCase'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('case_id', i, 0) as number };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	response = await apiRequest.call(this, 'GET', `case/export`, body, query);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

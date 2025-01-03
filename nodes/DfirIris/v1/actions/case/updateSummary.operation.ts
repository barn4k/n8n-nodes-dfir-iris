import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { apiRequest } from '../../transport';
import { types } from '../../helpers';
import * as icase from './commonDescription';

const properties: INodeProperties[] = [
	icase.rCaseId,
	icase.rCaseDescription,

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw],
	},
];

const displayOptions = {
	show: {
		resource: ['case'],
		operation: ['updateSummary'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('case_id', i, 0) as number };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	const options = this.getNodeParameter('options', i, {});

	body.case_description = this.getNodeParameter('case_description', i, 0) as string;

	response = await apiRequest.call(this, 'POST', `case/summary/update`, body, query);

	const isRaw = (options.isRaw as boolean) || false;
	let responseModified = response as any;

	if (!isRaw) responseModified = { status: 'success' };

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseModified as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Timeline.resource';
import { apiRequest } from '../../transport';
import * as local from './commonDescription';

const properties: INodeProperties[] = [
	{...local.eventId, required: true},
];

const displayOptions = {
	show: {
		resource: ['timeline'],
		operation: ['deleteEvent'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	const body: IDataObject = {};


	const response = await apiRequest.call(
		this,
		'POST',
		`${endpoint}/events/delete/${this.getNodeParameter(local.eventId.name, i)}`,
		body,
		query,
	);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response),
		{ itemData: { item: i } },
	);

	return executionData;
}

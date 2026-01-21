import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { apiRequest } from '../../transport';
import { types } from '../../helpers';

const properties: INodeProperties[] = [
	{
		displayName: 'How Many Tasks to Return',
		name: 'rows_count',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 20,
	},

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
		resource: ['module'],
		operation: ['listTasks'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let response;

	response = await apiRequest.call(
		this,
		'GET',
		'dim/tasks/list/' + (this.getNodeParameter('rows_count', i, 10) as string),
	);
	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	
	if (!isRaw) response = response.data;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

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
		displayName: 'Choose Object Type',
		name: 'object_type',
		type: 'options',
		options: [
			{
				name: 'Asset',
				value: 'asset',
			},
			{
				name: 'Case',
				value: 'case',
			},
			{
				name: 'Event',
				value: 'event',
			},
			{
				name: 'Evidence',
				value: 'evidence',
			},
			{
				name: 'Global Task',
				value: 'global_task',
			},
			{
				name: 'IOC',
				value: 'ioc',
			},
			{
				name: 'Note',
				value: 'note',
			},
			{
				name: 'Task',
				value: 'task',
			},
		],
		default: 'case',
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
		operation: ['listHooks'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let response;

	response = await apiRequest.call(
		this,
		'GET',
		`dim/hooks/options/${this.getNodeParameter('object_type', i, 'case')}/list`,
		{}
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

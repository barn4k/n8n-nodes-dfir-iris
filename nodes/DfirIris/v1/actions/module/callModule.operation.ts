import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { apiRequest } from '../../transport';

const properties: INodeProperties[] = [
	{
		displayName: 'Case Object Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Asset', value: 'asset' },
			{ name: 'Case', value: 'case' },
			{ name: 'Event', value: 'event' },
			{ name: 'Evidence', value: 'evidence' },
			{ name: 'Global Task', value: 'global_task' },
			{ name: 'IOC', value: 'ioc' },
			{ name: 'Note', value: 'note' },
			{ name: 'Task', value: 'task' },
		],
		default: 'case',
	},
	{
		displayName: 'Select Module Name or ID',
		name: 'moduleData',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getModules',
			loadOptionsDependsOn: ['type'],
		},
		default: '',
		// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a> with syntax: "hook_name;manual_hook_ui_name;module_name"',
	},
	{
		displayName: 'Module Targets',
		name: 'targetsString',
		type: 'string',
		default: '',
		description: 'Comma-separated list of the object IDs. E.g. task IDs, ioc IDs, etc',
	},
];

const displayOptions = {
	show: {
		resource: ['module'],
		operation: ['callModule'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	const body: IDataObject = {};

	[body.hook_name, body.module_name, body.hook_ui_name] = (
		this.getNodeParameter('moduleData', i) as string
	).split(';');

	body.type = this.getNodeParameter('type', i) as string;
	body.targets = (this.getNodeParameter('targetsString', i) as string).replace(/ /g, '').split(',');

	const response = await apiRequest.call(this, 'POST', 'dim/hooks/call', body, query);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject),
		{ itemData: { item: i } },
	);

	return executionData;
}

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Task.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';

const fields = [
	'custom_attributes',
	'id',
	'modification_history',
	'task_assignees',
	'task_case_id',
	'task_close_date',
	'task_description',
	'task_last_update',
	'task_open_date',
	'task_status_id',
	'task_tags',
	'task_title',
	'task_userid_close',
	'task_userid_open',
	'task_userid_update',
	'task_uuid',
];

const properties: INodeProperties[] = [
	{
		displayName: 'Task Name or ID',
		name: 'id',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getTasks',
			loadOptionsDependsOn: ['cid'],
		},
		default: '',
		required: true,
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw, ...types.fieldProperties(fields)],
	},
];

const displayOptions = {
	show: {
		resource: ['task'],
		operation: ['get'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response;

	response = await apiRequest.call(
		this,
		'GET',
		(`${endpoint}/` + this.getNodeParameter('id', i)) as string,
		{},
		query,
	);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	
	// field remover
	if (Object.prototype.hasOwnProperty.call(options, 'fields'))
		response.data = utils.fieldsRemover((response.data as IDataObject[]), options);
	if (!isRaw) response = response.data;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

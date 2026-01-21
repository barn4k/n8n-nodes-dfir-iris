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
		displayName: 'Task Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
	},
	{
		displayName: 'Task Description',
		name: 'task_description',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
	},
	{
		displayName: 'Task Assignee Name or ID',
		name: 'assignee',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUsers',
		},
		default: '',
		required: true,
		description:
			'To whom assign a task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Task Status',
		name: 'status',
		type: 'options',
		default: 1,
		options: [
			{
				value: 1,
				name: 'To Do',
			},
			{
				value: 2,
				name: 'In Progress',
			},
			{
				value: 3,
				name: 'On Hold',
			},
			{
				value: 4,
				name: 'Done',
			},
			{
				value: 5,
				name: 'Canceled',
			},
		],
		required: true,
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Task Tags',
				name: 'task_tags',
				type: 'string',
				default: '',
				description: 'Task tags as comma-separated string',
			},
			{
				displayName: 'Custom Attributes',
				name: 'custom_attributes',
				type: 'json',
				default: 0,
				description: 'Add custom attributes',
			},
		],
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
		operation: ['create'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response;
	const body: IDataObject = {};

	body.task_title = this.getNodeParameter('title', i) as string;
	body.task_description = this.getNodeParameter('task_description', i) as string;
	body.task_assignees_id = [this.getNodeParameter('assignee', i) as number];
	body.task_status_id = this.getNodeParameter('status', i) as number;
	utils.addAdditionalFields.call(this, body, i);

	response = await apiRequest.call(this, 'POST', `${endpoint}/add`, body, query);

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

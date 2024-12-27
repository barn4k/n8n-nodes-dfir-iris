import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';

const properties: INodeProperties[] = [
	{
		displayName: 'Object Name',
		name: 'obj_name',
		type: 'options',
		options: [
			{name: "Asset", value: "assets"},
			// {name: "Event", value: "events"},
			// {name: "Evidence", value: "evidences"},
			{name: "IOC", value: "ioc"},
			{name: "Note", value: "notes"},
			{name: "Task", value: "tasks"},
		],
		default: 'tasks',
		required: true,
	},
	{
		displayName: 'Object ID',
		name: 'obj_id',
		type: 'string',
		default: '',
		required: true,
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw, ...types.fieldProperties(types.commentFields)],
	},
];

const displayOptions = {
	show: {
		resource: ['comment'],
		operation: ['getAll'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];

	const obj_name = this.getNodeParameter('obj_name', i) as string;
	const obj_id = this.getNodeParameter('obj_id', i) as string;

	response = await apiRequest.call(
		this,
		'GET',
		`case/${obj_name}/${obj_id}/comments/list`,
		{},
		query
	);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	let responseModified = response as any;

	// field remover
	if (options.hasOwnProperty('fields'))
		responseModified.data = utils.fieldsRemover(responseModified.data, options);
	if (!isRaw) responseModified = responseModified.data;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseModified as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

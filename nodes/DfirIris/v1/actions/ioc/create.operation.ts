import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './IOC.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';

const properties: INodeProperties[] = [
	{
		displayName: 'IOC Type Name or ID',
		name: 'type',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getIOCTypes',
		},
		default: '',
		required: true,
	},
	{
		displayName: 'IOC Description',
		name: 'description',
		type: 'string',
		default: '',
		required: true,
	},
	{
		displayName: 'IOC Value',
		name: 'value',
		type: 'string',
		default: '',
		required: true,
	},
	{
		displayName: 'IOC TLP',
		name: 'tlpId',
		type: 'options',
		options: [
			{ value: 1, name: 'Red' },
			{ value: 2, name: 'Amber' },
			{ value: 3, name: 'Green' },
			{ value: 4, name: 'Clear' },
			{ value: 5, name: 'Amber Strict' },
		],
		default: 1,
		required: true,
		description: 'IOC Name',
	},
	{
		displayName: 'IOC Tags',
		name: 'tags',
		type: 'string',
		validateType: 'string',
		ignoreValidationDuringExecution: true,
		default: '',
		required: true,
		description: 'IOC Tags, comma-separated',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
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
		options: [...types.returnRaw, ...types.fieldProperties(types.iocFields)],
	},
];

const displayOptions = {
	show: {
		resource: ['ioc'],
		operation: ['create'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	body.ioc_type_id = this.getNodeParameter('type', i) as number;
	body.ioc_tlp_id = this.getNodeParameter('tlpId', i) as string;
	body.ioc_value = this.getNodeParameter('value', i) as string;
	body.ioc_description = this.getNodeParameter('description', i) as string;
	body.ioc_tags = this.getNodeParameter('tags', i) as string;
	utils.addAdditionalFields.call(this, body, i);

	response = await apiRequest.call(this, 'POST', `${endpoint}/add`, body, query);

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

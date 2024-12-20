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
		displayName: 'IOC Name or ID',
		name: 'id',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getIOCs',
		},
		default: '',
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
				displayName: 'Custom Attributes',
				name: 'custom_attributes',
				type: 'json',
				default: 0,
				description: 'Add custom attributes',
			},
			{
				displayName: 'IOC Description',
				name: 'ioc_description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'IOC Tags',
				name: 'ioc_tags',
				type: 'string',
				validateType: 'string',
				ignoreValidationDuringExecution: true,
				default: '',
				description: 'IOC Tags, comma-separated',
			},
			{
				displayName: 'IOC TLP',
				name: 'ioc_tlp_id',
				type: 'options',
				options: [
					{ value: 1, name: 'Red' },
					{ value: 2, name: 'Amber' },
					{ value: 3, name: 'Green' },
					{ value: 4, name: 'Clear' },
					{ value: 5, name: 'Amber Strict' },
				],
				default: 1,
				description: 'IOC Name',
			},
			{
				displayName: 'IOC Type Name or ID',
				name: 'ioc_type_id',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getIOCTypes',
				},
				default: '',
			},
			{
				displayName: 'IOC Value',
				name: 'ioc_value',
				type: 'string',
				default: '',
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
		operation: ['update'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	utils.addAdditionalFields.call(this, body, i);

	response = await apiRequest.call(
		this,
		'POST',
		(`${endpoint}/update/` + this.getNodeParameter('id', i)) as string,
		body,
		query,
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

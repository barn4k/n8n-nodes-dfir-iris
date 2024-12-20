import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Asset.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';

const properties: INodeProperties[] = [
	{
		displayName: 'Asset Name',
		name: 'assetName',
		type: 'string',
		default: '',
		required: true,
	},
	{
		displayName: 'Asset Type Name or ID',
		name: 'assetType',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getAssetTypes',
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
				displayName: 'Asset Analysis Status',
				name: 'analysis_status_id',
				type: 'options',
				options: [
					{ value: 1, name: 'Unspecified' },
					{ value: 2, name: 'To Be Done' },
					{ value: 3, name: 'Started' },
					{ value: 4, name: 'Pending' },
					{ value: 5, name: 'Canceled' },
					{ value: 6, name: 'Done' },
				],
				default: 1,
			},
			{
				displayName: 'Asset Compromise Status',
				name: 'asset_compromise_status_id',
				type: 'options',
				options: [
					{ value: 0, name: 'To Be Determined' },
					{ value: 1, name: 'Compromised' },
					{ value: 2, name: 'Not Compromised' },
					{ value: 3, name: 'Unknown' },
				],
				default: 0,
			},
			{
				displayName: 'Asset Description',
				name: 'asset_description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Asset Domain',
				name: 'asset_domain',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Asset Info',
				name: 'asset_info',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Asset IP',
				name: 'asset_ip',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Asset Tags',
				name: 'asset_tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
			},
			{
				displayName: 'Custom Attributes',
				name: 'custom_attributes',
				type: 'json',
				default: 0,
				description: 'Add custom attributes',
			},
			{
				displayName: 'IOC Reference Names or IDs',
				name: 'ioc_links',
				placeholder: 'Add IOC Reference',
				type: 'multiOptions',
				typeOptions: {
					// multipleValues: true,
					loadOptionsMethod: 'getIOCs',
				},
				default: [],
				description:
					'Related IOCs. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw, ...types.fieldProperties(types.assetFields)],
	},
];

const displayOptions = {
	show: {
		resource: ['asset'],
		operation: ['create'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	body.asset_type_id = this.getNodeParameter('assetType', i) as number;
	body.asset_name = this.getNodeParameter('assetName', i) as string;
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

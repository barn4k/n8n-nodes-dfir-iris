import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Asset.resource'
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';

const fields: string[] = [
	'asset_enrichment',
	'asset_type',
	'asset_type_id',
	'case_id',
	'asset_description',
	'asset_id',
	'analysis_status_id',
	'custom_attributes',
	'asset_info',
	'user_id',
	'date_added',
	'date_update',
	'asset_name',
	'asset_ip',
	'asset_tags',
	'asset_compromise_status_id',
	'asset_uuid',
	'asset_domain',
	'linked_ioc',
].sort();

const properties: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			...types.returnRaw,
			...types.fieldProperties(fields)
		],
	},
];

const displayOptions = {
	show: {
		resource: ['asset'],
		operation: ['getAll'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[]

	response = await apiRequest.call(
		this,
		'GET',
		`${endpoint}/list`,
		{},
		query,
	);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = options.isRaw as boolean || false
	let responseModified = response as any

	// field remover
	if (options.hasOwnProperty('fields'))
		responseModified.data.assets = utils.fieldsRemover(responseModified.data.assets, options)
	if (!isRaw)
		responseModified = responseModified.data.assets

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseModified as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

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
import * as local from './commonDescription';

const properties: INodeProperties[] = [
	local.rAssetId,

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
		(`${endpoint}/` + this.getNodeParameter('asset_id', i)) as string,
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

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { NodeApiError, updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Asset.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';
import * as local from './commonDescription';

const properties: INodeProperties[] = [
	{...local.assetName, required: true},
	{...local.assetType, required: true},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			local.assetAnalysisStatus,
			local.assetCompromiseStatus,
			local.assetDescription,
			local.assetDomain,
			local.assetInfo,
			local.assetIP,
			local.assetTags,
			types.customAttributes,
			local.iocReference,
		],
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw, ...types.fieldProperties(types.assetFields), {
			displayName: 'Ignore Empty',
			displayOptions: {
				hide: {
					'@version': [1],
				},
			},
			name: 'ignore_empty',
			type: 'boolean',
			default: false,
			description: 'Whether to ignore empty or null Asset Name. Won\'t send the request if the value is empty.',
		}],
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
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response;
	const body: IDataObject = {};

	body.asset_type_id = this.getNodeParameter(local.assetType.name, i) as number;
	body.asset_name = this.getNodeParameter(local.assetName.name, i) as string;
	utils.addAdditionalFields.call(this, body, i);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	
	if (body.asset_name === '' || body.asset_name === null || body.asset_name === undefined){
		// added in v1.1
		if (options.ignore_empty === true) {
			return this.helpers.returnJsonArray([{status: 'skipped', reason: 'Asset Name is empty and "Ignore Empty" option is enabled.'}]);
		} else {
			throw new NodeApiError(this.getNode(), { message: 'Asset Name is required and cannot be empty.' });
		}
	}

	response = await apiRequest.call(this, 'POST', `${endpoint}/add`, body, query);

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

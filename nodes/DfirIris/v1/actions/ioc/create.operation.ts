import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { NodeApiError, updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './IOC.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';
import * as local from './commonDescription';

const properties: INodeProperties[] = [
	{...local.iocType, required: true},
	{...local.iocValue, required: true},
	{...local.iocDescription, required: true},
	{...local.iocTags, required: true},
	{...local.iocTLP, required: true},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [types.customAttributes],
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw, ...types.fieldProperties(types.iocFields), {
			displayName: 'Ignore Empty',
			displayOptions: {
				hide: {
					'@version': [1],
				},
			},
			name: 'ignore_empty',
			type: 'boolean',
			default: false,
			description: 'Whether to ignore empty or null IOC Value. Won\'t send the request if the value is empty.',
		}],
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
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response;
	const body: IDataObject = {};

	body.ioc_type_id = this.getNodeParameter(local.iocType.name, i) as number;
	body.ioc_tlp_id = this.getNodeParameter(local.iocTLP.name, i) as string;
	body.ioc_value = this.getNodeParameter(local.iocValue.name, i) as string;
	body.ioc_description = this.getNodeParameter(local.iocDescription.name, i) as string;
	body.ioc_tags = this.getNodeParameter(local.iocTags.name, i) as string;
	utils.addAdditionalFields.call(this, body, i);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	
	
	if (body.ioc_value === '' || body.ioc_value === null || body.ioc_value === undefined){
		// added in v1.1
		if (options.ignore_empty === true) {
			return this.helpers.returnJsonArray([{status: 'skipped', reason: 'IOC Value is empty and "Ignore Empty" option is enabled.'}]);
		} else {
			throw new NodeApiError(this.getNode(), { message: 'IOC Value is required and cannot be empty.' });
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

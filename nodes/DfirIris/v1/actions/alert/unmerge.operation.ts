import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Alert.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';
import * as local from './commonDescription';

const fields = [
	'case_customer',
	'case_description',
	'case_id',
	'case_name',
	'case_soc_id',
	'case_uuid',
	'classification_id',
	'close_date',
	'closing_note',
	'custom_attributes',
	'modification_history',
	'open_date',
	'owner_id',
	'status_id',
	'user_id',
];

const properties: INodeProperties[] = [
	local.rAlertId,
	{
		displayName: 'Target Case ID',
		name: 'case_id',
		type: 'number',
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
		resource: ['alert'],
		operation: ['unmerge'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	body.target_case_id = this.getNodeParameter('case_id', i) as number;

	response = await apiRequest.call(
		this,
		'POST',
		(`${endpoint}/unmerge/` + this.getNodeParameter('alert_id', i)) as string,
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

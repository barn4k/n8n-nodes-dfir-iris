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
	'alert_classification_id',
	'alert_context',
	'alert_creation_time',
	'alert_customer_id',
	'alert_description',
	'alert_id',
	'alert_note',
	'alert_owner_id',
	'alert_resolution_status_id',
	'alert_severity_id',
	'alert_source',
	'alert_source_content',
	'alert_source_event_time',
	'alert_source_link',
	'alert_source_ref',
	'alert_status_id',
	'alert_tags',
	'alert_title',
	'alert_uuid',
	'assets',
	'cases',
	'classification',
	'comments',
	'customer',
	'iocs',
	'modification_history',
	'owner',
	'related_alerts',
	'resolution_status',
	'severity',
	'status',
];

const properties: INodeProperties[] = [
	local.rAlertId,
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
		(`${endpoint}/` + this.getNodeParameter('alert_id', i)) as string,
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

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
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'As Event',
				name: 'import_as_event',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'List of Asset UUIDs',
				name: 'assets_import_list',
				type: 'string',
				default: '',
				description:
					'A comma-separated list of UUID matching the Assets to import into the case. These UUIDs are provided when getting information on an alert.',
			},
			{
				displayName: 'List of IOC UUIDs',
				name: 'iocs_import_list',
				type: 'string',
				default: '',
				description:
					'A comma-separated list of UUID matching the IOCs to import into the case. These UUIDs are provided when getting information on an alert.',
			},
			{
				displayName: 'Note',
				name: 'note',
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
		options: [...types.returnRaw, ...types.fieldProperties(fields)],
	},
];

const displayOptions = {
	show: {
		resource: ['alert'],
		operation: ['merge'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response;
	const body: IDataObject = {};

	body.target_case_id = this.getNodeParameter('case_id', i) as number;

	utils.addAdditionalFields.call(this, body, i);

	body.assets_import_list = (body.assets_import_list as string).split(',') || [];
	body.iocs_import_list = (body.iocs_import_list as string).split(',') || [];

	response = await apiRequest.call(
		this,
		'POST',
		(`${endpoint}/merge/` + this.getNodeParameter('alert_id', i)) as string,
		body,
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

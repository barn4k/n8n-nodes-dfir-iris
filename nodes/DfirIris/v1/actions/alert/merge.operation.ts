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

const properties: INodeProperties[] = [
	{
		displayName: 'Alert ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
	},
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
		options: [...types.returnRaw, ...types.fieldProperties(types.caseFields)],
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
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	body.target_case_id = this.getNodeParameter('case_id', i) as number;

	utils.addAdditionalFields.call(this, body, i);

	// @ts-ignore
	body.assets_import_list = body.assets_import_list?.split(',') || [];
	// @ts-ignore
	body.iocs_import_list = body.iocs_import_list?.split(',') || [];

	response = await apiRequest.call(
		this,
		'POST',
		(`${endpoint}/merge/` + this.getNodeParameter('id', i)) as string,
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

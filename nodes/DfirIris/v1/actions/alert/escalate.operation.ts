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
import * as icase from '../case/commonDescription';

const properties: INodeProperties[] = [
	local.rAlertId,
	{
		displayName: 'Case Title',
		name: 'case_title',
		required: true,
		type: 'string',
		default: '',
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
				description: 'Whether to add alert to the case timeline',
			},
			icase.caseTags,
			icase.caseTemplateId,
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
		operation: ['escalate'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	body.case_title = this.getNodeParameter('case_title', i) as string;

	utils.addAdditionalFields.call(this, body, i);
	body.case_tags ??= '';
	// @ts-ignore
	body.assets_import_list = body.assets_import_list?.split(',') || [];
	// @ts-ignore
	body.iocs_import_list = body.iocs_import_list?.split(',') || [];

	response = await apiRequest.call(
		this,
		'POST',
		(`${endpoint}/escalate/` + this.getNodeParameter('alert_id', i)) as string,
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

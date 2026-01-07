import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Alert.resource';
import { apiRequestAll } from '../../transport';
import { types, utils } from '../../helpers';
import * as local from './commonDescription';

const fields = [
	"alert_classification_id",
	"alert_context",
	"alert_creation_time",
	"alert_customer_id",
	"alert_description",
	"alert_id",
	"alert_note",
	"alert_owner_id",
	"alert_resolution_status_id",
	"alert_severity_id",
	"alert_source",
	"alert_source_content",
	"alert_source_event_time",
	"alert_source_link",
	"alert_source_ref",
	"alert_status_id",
	"alert_tags",
	"alert_title",
	"alert_uuid",
	"assets",
	"cases",
	"classification",
	"comments",
	"customer",
	"iocs",
	"modification_history",
	"owner",
	"resolution_status",
	"severity",
	"status"
]

const properties: INodeProperties[] = [
	...types.returnAllOrLimit,
	{
		displayName: 'Sort Order',
		name: 'sort_dir',
		type: 'options',
		required: true,
		options: [
			{ name: 'Ascending', value: 'asc' },
			{ name: 'Descending', value: 'desc' },
		],
		default: 'asc',
	},
	{
		displayName: 'Sort By',
		name: 'sort_by',
		type: 'options',
		required: true,
		options: [
			{ name: 'Alert ID', value: 'alert_id' },
			{ name: 'Name', value: 'alert_title' },
			{ name: 'Initial Date', value: 'alert_creation_time' },
		],
		description: 'Sorting field',
		default: 'alert_id',
	},
	{
		displayName: 'Filter Options',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			local.alertAssets,
			local.alertClassification,
			local.alertCustomer,
			{ ...local.alertDescription, description: "You can use part of the string" },
			local.alertEndDate,
			local.alertIds,
			local.alertIocs,
			local.alertOwner,
			// local.alertResolutionStatus, // filter not work
			local.alertSeverity,
			{ ...local.alertSource, description: "You can use part of the string" },
			local.alertStartDate,
			local.alertStatus,
			{ ...local.alertTags, description: "You can use part of the string" },
			{ ...local.alertTitle, description: "You can use part of the string" },
		],
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			...types.returnRaw,
			...types.fieldProperties(fields),
			{
				displayName: 'Start Page',
				name: 'startPage',
				type: 'number',
				default: 1,
				description: 'Controls how many entries to skip',
			}
		],
	},
];

const displayOptions = {
	show: {
		resource: ['alert'],
		operation: ['filterAlerts'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: 1 };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	body.sort_dir = this.getNodeParameter('sort_dir', i) as string;
	body.order_by = this.getNodeParameter('sort_by', i) as string;

	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	utils.addAdditionalFields.call(this, body, i);

	Object.assign(query, body);

	response = await apiRequestAll.call(
		this,
		'GET',
		`${endpoint}/filter`,
		{},
		body,
		returnAll ? 0 : (this.getNodeParameter('limit', i) as number),
		this.getNodeParameter('options.startPage', i, 1) as number,
		'alerts',
	);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	let responseModified = response as any;

	// field remover
	if (options.hasOwnProperty('fields') && responseModified.hasOwnProperty('data'))
		responseModified.data.alerts = utils.fieldsRemover(responseModified.data?.alerts, options);

	if (!isRaw) responseModified = responseModified.data?.alerts;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseModified as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

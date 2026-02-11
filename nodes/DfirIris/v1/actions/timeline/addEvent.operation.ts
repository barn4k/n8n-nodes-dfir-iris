import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Timeline.resource';
import { apiRequest } from '../../transport';
import { utils, types } from '../../helpers';
import * as local from './commonDescription';

const fields = [
    "custom_attributes",
    "event_assets",
    "event_category_id",
    "event_color",
    "event_content",
    "event_date",
    "event_in_graph",
    "event_in_summary",
    "event_iocs",
    "event_raw",
    "event_source",
    "event_sync_iocs_assets",
    "event_tags",
    "event_title",
    "event_tz"
]

const properties: INodeProperties[] = [
	{...local.eventAssetsMV, required: true},
	{...local.eventCategory, required: true},
	{...local.eventDate, required: true},
	{...local.eventIocsMV, required: true},
	{...local.eventTitle, required: true},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			local.eventColor,
			local.eventContent,
			local.eventInGraph,
			local.eventInSummary,
			local.eventRaw,
			local.eventSource,
			local.eventSyncIocsAssets,
			local.eventTags,
			local.parentEventId,
			types.customAttributes,
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.fieldProperties(fields)],
	},
];

const displayOptions = {
	show: {
		resource: ['timeline'],
		operation: ['addEvent'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response;
	const body: IDataObject = {};

	body.event_title = this.getNodeParameter(local.eventTitle.name, i) as string;
	body.event_date = (this.getNodeParameter(local.eventDate.name, i) as string).substring(0, 19) + '.000';
	body.event_tz = "+00:00"
	body.event_category_id = this.getNodeParameter(local.eventCategory.name, i) as number;
	body.event_assets = this.getNodeParameter(local.eventAssetsMV.name, i) as number[];
	body.event_iocs = this.getNodeParameter(local.eventIocsMV.name, i) as number[];

	utils.addAdditionalFields.call(this, body, i);

	response = await apiRequest.call(
		this,
		'POST',
		`${endpoint}/events/add`,
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

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
    "case",
    "case_id",
    "category",
    "children",
    "custom_attributes",
    "event_added",
    "event_color",
    "event_content",
    "event_date",
    "event_date_wtz",
    "event_id",
    "event_in_graph",
    "event_in_summary",
    "event_is_flagged",
    "event_raw",
    "event_source",
    "event_tags",
    "event_title",
    "event_tz",
    "event_uuid",
    "modification_history",
    "parent",
    "parent_event_id",
    "registry",
    "user",
    "user_id"
]

const properties: INodeProperties[] = [
	{...local.eventId, required: true},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw,...types.fieldProperties(fields)],
	},
];

const displayOptions = {
	show: {
		resource: ['timeline'],
		operation: ['flagEvent'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response;
	const body: IDataObject = {};

	response = await apiRequest.call(
		this,
		'GET',
		`${endpoint}/events/flag/${this.getNodeParameter(local.eventId.name, i)}`,
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

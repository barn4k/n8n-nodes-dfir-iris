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
    "acquisition_date",
    "case",
    "case_id",
    "chain_of_custody",
    "custom_attributes",
    "date_added",
    "end_date",
    "file_description",
    "file_hash",
    "file_size",
    "file_uuid",
    "filename",
    "id",
    "start_date",
    "type",
    "type_id",
    "user",
    "user_id"
]

const properties: INodeProperties[] = [
	{
		displayName: 'All Query conditions work as logic AND clause',
		name: 'notice',
		type: 'notice',
		default: '',
	},
	{
		displayName: 'Query',
		name: 'queryUI',
		type: 'collection',
		placeholder: 'Add Condition',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		description: 'Filters to apply to the timeline events',
		options: [
			local.eventAssetsMV,
			local.eventIocsMV,  // doesn't work as intended with v2.4.19
			local.eventTags,
			local.eventTitle,
			local.eventDescription,
			local.eventRaw,
			local.eventCategory,
			local.eventSource,
			{
				displayName: 'Event Start Date',
				name: 'event_start_date',
				type: 'dateTime',
				default: '',
				description: 'Start date to filter timeline events from',
			},
			{
				displayName: 'Event End Date',
				name: 'event_end_date',
				type: 'dateTime',
				default: '',
				description: 'End date to filter timeline events to',
			}
		]
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
		resource: ['timeline'],
		operation: ['queryTimeline'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number, q: {} };
	let response;
	const body: IDataObject = {};
	const q: IDataObject = {}
	const irisLogger = new utils.IrisLog(this.logger);

	const queryFields = this.getNodeParameter('queryUI', i, []) as IDataObject[];
	irisLogger.info('queryFields', {queryFields});
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventAssetsMV.name))) {
		const filteredData = queryFields.filter((field) => Object.prototype.hasOwnProperty.call(field, local.eventAssetsMV.name)) as IDataObject[];
		q.asset_id = filteredData.flatMap((fields) => fields[local.eventAssetsMV.name]);
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventIocsMV.name))) {
		const filteredData = queryFields.filter((field) => Object.prototype.hasOwnProperty.call(field, local.eventIocsMV.name)) as IDataObject[];
		q.ioc_id = filteredData.flatMap((fields) => fields[local.eventIocsMV.name]);
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventTags.name))) {
		const filteredData = queryFields.filter((field) => Object.prototype.hasOwnProperty.call(field, local.eventTags.name)) as IDataObject[];
		q.tag = filteredData.map((fields) => fields[local.eventTags.name]);
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventTitle.name))) {
		const filteredData = queryFields.filter((field) => Object.prototype.hasOwnProperty.call(field, local.eventTitle.name)) as IDataObject[];
		q.title = filteredData.map((fields) => fields[local.eventTitle.name]);
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventDescription.name))) {
		const filteredData = queryFields.filter((field) => Object.prototype.hasOwnProperty.call(field, local.eventDescription.name)) as IDataObject[];
		q.description = filteredData.map((fields) => fields[local.eventDescription.name]);
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventRaw.name))) {
		const filteredData = queryFields.filter((field) => Object.prototype.hasOwnProperty.call(field, local.eventRaw.name)) as IDataObject[];
		q.raw = filteredData.map((fields) => fields[local.eventRaw.name]);
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventCategory.name))) {
		const filteredData = queryFields.filter((field) => Object.prototype.hasOwnProperty.call(field, local.eventCategory.name)) as IDataObject[];
		q.category = filteredData.map((fields) => fields[local.eventCategory.name]);
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventSource.name))) {
		const filteredData = queryFields.filter((field) => Object.prototype.hasOwnProperty.call(field, local.eventSource.name)) as IDataObject[];
		q.source = filteredData.map((fields) => fields[local.eventSource.name]);
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, 'event_start_date'))) {
		const filteredData = queryFields.filter((field) => Object.prototype.hasOwnProperty.call(field, 'event_start_date')) as IDataObject[];
		q.startDate = filteredData.map((fields) => fields['event_start_date']);
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, 'event_end_date'))) {
		const filteredData = queryFields.filter((field) => Object.prototype.hasOwnProperty.call(field, 'event_end_date')) as IDataObject[];
		q.endDate = filteredData.map((fields) => fields['event_end_date']);
	}

	if (Object.keys(q).length > 0){
		query.q = JSON.stringify(q);
	} else {
		query.q = "{}"
	}

	response = await apiRequest.call(
		this,
		'GET',
		`${endpoint}/advanced-filter`,
		body,
		query,
	);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	
	// field remover
	if (Object.prototype.hasOwnProperty.call(options, 'fields') && response.data && typeof response.data === 'object' && 'timeline' in response.data) {
		const data = response.data as IDataObject;
		data.timeline = utils.fieldsRemover((data.timeline as IDataObject[]), options);
	}
	if (!isRaw) response = (response.data as IDataObject).timeline;
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

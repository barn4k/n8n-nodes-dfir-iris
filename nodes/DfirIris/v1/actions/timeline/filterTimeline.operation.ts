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
		displayName: 'Notice',
		description: 'All conditions work as logic AND clause',
		name: 'notice',
		type: 'notice',
		default: '',
	},
	{
		displayName: 'Query',
		name: 'queryUI',
		type: 'fixedCollection',
		placeholder: 'Add Condition',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		description: 'Filters to apply to the timeline events',
		options: [
			{
				name: 'queryFields',
				displayName: 'Query Field',
				values: [
					{...local.eventAssetsMV, type: "options", typeOptions: {...local.eventAssetsMV.typeOptions, multipleValues: false}},
					{...local.eventIocsMV, type: "options", typeOptions: {...local.eventIocsMV.typeOptions, multipleValues: false}},
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
					},
				]
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
		resource: ['evidence'],
		operation: ['filterTimeline'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number, q: {} };
	let response;
	const body: IDataObject = {};
	const q: IDataObject = {}

	const queryFields = this.getNodeParameter('queryUI.queryFields', i, []) as IDataObject[];
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventAssetsMV.name))) {
		const asset = queryFields.find((field) => Object.prototype.hasOwnProperty.call(field, local.eventAssetsMV.name)) as IDataObject;
		q.asset = asset.value;
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventIocsMV.name))) {
		const ioc = queryFields.find((field) => Object.prototype.hasOwnProperty.call(field, local.eventIocsMV.name)) as IDataObject;
		q.ioc = ioc.value;
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventTags.name))) {
		q.tag = queryFields.find((field) => Object.prototype.hasOwnProperty.call(field, local.eventTags.name)) as IDataObject;
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventTitle.name))) {
		q.title = queryFields.find((field) => Object.prototype.hasOwnProperty.call(field, local.eventTitle.name)) as IDataObject;
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventDescription.name))) {
		q.description = queryFields.find((field) => Object.prototype.hasOwnProperty.call(field, local.eventDescription.name)) as IDataObject;
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventRaw.name))) {
		q.raw = queryFields.find((field) => Object.prototype.hasOwnProperty.call(field, local.eventRaw.name)) as IDataObject;
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventCategory.name))) {
		q.category = queryFields.find((field) => Object.prototype.hasOwnProperty.call(field, local.eventCategory.name)) as IDataObject;
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, local.eventSource.name))) {
		q.source = queryFields.find((field) => Object.prototype.hasOwnProperty.call(field, local.eventSource.name)) as IDataObject;
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, 'event_start_date'))) {
		q.startDate = queryFields.find((field) => Object.prototype.hasOwnProperty.call(field, 'event_start_date')) as IDataObject;
	}
	if (queryFields.some((field) => Object.prototype.hasOwnProperty.call(field, 'event_end_date'))) {
		q.endDate = queryFields.find((field) => Object.prototype.hasOwnProperty.call(field, 'event_end_date')) as IDataObject;
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
	if (Object.prototype.hasOwnProperty.call(options, 'fields') && response.data && typeof response.data === 'object' && 'evidences' in response.data) {
		const data = response.data as IDataObject;
		data.evidences = utils.fieldsRemover((data.evidences as IDataObject[]), options);
	}
	if (!isRaw) response = (response.data as IDataObject).evidences;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

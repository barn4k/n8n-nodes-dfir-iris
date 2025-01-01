// import type {
// 	IDataObject,
// 	IExecuteFunctions,
// 	INodeExecutionData,
// 	INodeProperties,
// } from 'n8n-workflow';

// import { updateDisplayOptions } from 'n8n-workflow';

// import { endpoint } from './Case.resource';
// import { apiRequestAll } from '../../transport';
// import { types, utils } from '../../helpers';

// const properties: INodeProperties[] = [
// 	{
// 		displayName: 'Additional Fields',
// 		name: 'additionalFields',
// 		type: 'collection',
// 		placeholder: 'Add Field',
// 		default: {},
// 		options: [
// 			{
// 				displayName: 'Alert Assets',
// 				name: 'alert_assets',
// 				type: 'string',
// 				default: '',
// 				description: 'Comma-separated list of Alert Asset IDs',
// 				placeholder: '1,2,3',
// 			},
// 			{
// 				displayName: 'Alert Classification Name or ID',
// 				name: 'alert_classification_id',
// 				type: 'options',
// 				description:
// 					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
// 				typeOptions: {
// 					loadOptionsMethod: 'getAlertClassifications',
// 				},
// 				default: '',
// 			},
// 			{
// 				displayName: 'Alert Customer Name or ID',
// 				name: 'alert_customer_id',
// 				type: 'options',
// 				description:
// 					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
// 				typeOptions: {
// 					loadOptionsMethod: 'getCustomers',
// 				},
// 				default: '',
// 			},
// 			{
// 				displayName: 'Alert Description',
// 				name: 'alert_description',
// 				type: 'string',
// 				typeOptions: {
// 					rows: 4,
// 				},
// 				default: '',
// 			},
// 			{
// 				displayName: 'Alert End Date',
// 				name: 'source_end_date', // should be 'alert_end_date', but it's not working
// 				type: 'dateTime',
// 				default: '',
// 				description:
// 					'Time of the Event in UTC according to RFC. Works only together with start date.',
// 				hint: 'e.g. 2023-03-26T03:00:30',
// 			},
// 			{
// 				displayName: 'Alert IDs',
// 				name: 'alert_ids',
// 				type: 'string',
// 				default: '',
// 				description: 'Comma-separated list of Alert IDs',
// 				placeholder: '1,2,3',
// 			},
// 			{
// 				displayName: 'Alert IOCs',
// 				name: 'alert_iocs',
// 				type: 'string',
// 				default: '',
// 				description: 'Comma-separated list of Alert IOC IDs',
// 				placeholder: '1,2,3',
// 			},
// 			{
// 				displayName: 'Alert Owner Name or ID',
// 				name: 'alert_owner_id',
// 				type: 'options',
// 				typeOptions: {
// 					loadOptionsMethod: 'getUsers',
// 				},
// 				options: [],
// 				default: '',
// 				description:
// 					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
// 			},
// 			// ...types.alertResolutionStatus, // filter not work
// 			...types.alertSeverity,
// 			{
// 				displayName: 'Alert Source',
// 				name: 'alert_source',
// 				type: 'string',
// 				default: '',
// 				description: 'Source of the alert (where it comes from)',
// 			},
// 			{
// 				displayName: 'Alert Start Date',
// 				name: 'source_start_date', // should be 'alert_start_date', but it's not working
// 				type: 'dateTime',
// 				default: '',
// 				description:
// 					'Time of the Event in UTC according to RFC. Works only together with end date.',
// 				hint: 'e.g. 2023-03-26T03:00:30',
// 			},
// 			...types.alertStatus,
// 			{
// 				displayName: 'Alert Tags',
// 				name: 'alert_tags',
// 				type: 'string',
// 				default: '',
// 				description: 'Comma-separated list of tag names',
// 			},
// 			{
// 				displayName: 'Alert Title',
// 				name: 'alert_title',
// 				type: 'string',
// 				default: '',
// 			},
// 		],
// 	},

// 	{
// 		displayName: 'Options',
// 		name: 'options',
// 		type: 'collection',
// 		placeholder: 'Add Option',
// 		default: {},
// 		options: [...types.returnRaw],
// 	},
// ];

// const displayOptions = {
// 	show: {
// 		resource: ['alert'],
// 		operation: ['countAlerts'],
// 	},
// };

// export const description = updateDisplayOptions(displayOptions, properties);

// export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
// 	let query: IDataObject = { cid: 1, sort: 'desc' };
// 	let response: INodeExecutionData[];
// 	let body: IDataObject = {};

// 	utils.addAdditionalFields.call(this, body, i);
// 	console.log('updated body', body);

// 	Object.assign(query, body);

// 	response = await apiRequestAll.call(this, 'GET', `${endpoint}/filter`, {}, query, 1, 'alerts');

// 	const options = this.getNodeParameter('options', i, {});
// 	const isRaw = (options.isRaw as boolean) || false;
// 	let responseModified = response as any;
// 	console.debug('responseModified', responseModified);
// 	if (!isRaw) responseModified = { total: responseModified.data?.total || 0 };

// 	const executionData = this.helpers.constructExecutionMetaData(
// 		this.helpers.returnJsonArray(responseModified as IDataObject[]),
// 		{ itemData: { item: i } },
// 	);

// 	return executionData;
// }

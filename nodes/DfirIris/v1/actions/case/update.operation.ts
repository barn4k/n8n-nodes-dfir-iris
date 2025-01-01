// import type {
// 	IDataObject,
// 	IExecuteFunctions,
// 	INodeExecutionData,
// 	INodeProperties,
// 	INodePropertyOptions,
// } from 'n8n-workflow';

// import { updateDisplayOptions, NodeOperationError } from 'n8n-workflow';

// import type { IIOC, IAsset, IAlert } from '../../helpers/types';

// import { endpoint } from './Case.resource';
// import { apiRequest } from '../../transport';
// import { types, utils } from '../../helpers';

// const properties: INodeProperties[] = [
// 	{
// 		displayName: 'Alert ID',
// 		name: 'id',
// 		type: 'number',
// 		default: '',
// 		required: true,
// 	},
// 	{
// 		displayName: 'Additional Fields',
// 		name: 'additionalFields',
// 		type: 'collection',
// 		placeholder: 'Add Field',
// 		default: {},
// 		options: [
// 			// Asset
// 			{
// 				displayName: 'Add Assets',
// 				name: '__assetsCollection',
// 				type: 'fixedCollection',
// 				placeholder: 'Add Asset',
// 				default: {},
// 				typeOptions: {
// 					multipleValues: true,
// 				},
// 				options: [
// 					{
// 						name: 'assetData',
// 						displayName: 'Asset',
// 						values: [
// 							{
// 								displayName: 'Name',
// 								name: 'asset_name',
// 								type: 'string',
// 								required: true,
// 								default: '',
// 							},
// 							{
// 								displayName: 'Value',
// 								description: 'Markdown supported in cases',
// 								name: 'asset_description',
// 								type: 'string',
// 								default: '',
// 							},
// 							{
// 								displayName: 'Type Name or ID',
// 								name: 'asset_type_id',
// 								required: true,
// 								type: 'options',
// 								description:
// 									'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
// 								typeOptions: {
// 									loadOptionsMethod: 'getAssetTypes',
// 								},
// 								default: '',
// 							},
// 							{
// 								displayName: 'IP',
// 								name: 'asset_ip',
// 								type: 'string',
// 								default: '',
// 							},
// 							{
// 								displayName: 'Domain',
// 								name: 'asset_domain',
// 								type: 'string',
// 								default: '',
// 							},
// 							{
// 								displayName: 'Tags',
// 								name: 'asset_tags',
// 								type: 'string',
// 								default: '',
// 								description: 'Comma-separated list of tag names',
// 							},
// 							{
// 								displayName: 'Enrichment',
// 								name: 'asset_enrichment',
// 								type: 'json',
// 								default: '{}',
// 								description: 'JSON Object with additional data',
// 							},
// 						],
// 					},
// 				],
// 			},
// 			{
// 				displayName: 'Add Assets (JSON)',
// 				name: '__assetsCollectionJSON',
// 				type: 'json',
// 				description: 'Add data as array of assets. Will override usual setting.',
// 				default: '{}',
// 			},
// 			// IOC  // No property in API schema
// 			// {
// 			// 	displayName: 'Add IOCs',
// 			// 	name: '__iocsCollection',
// 			// 	type: 'fixedCollection',
// 			// 	placeholder: 'Add IOC',
// 			// 	default: {},
// 			// 	typeOptions: {
// 			// 		multipleValues: true,
// 			// 	},
// 			// 	options: [
// 			// 		{
// 			// 			name: 'iocData',
// 			// 			displayName: 'IOC',
// 			// 			values: [
// 			// 				{
// 			// 					displayName: 'Value',
// 			// 					name: 'ioc_value',
// 			// 					required: true,
// 			// 					type: 'string',
// 			// 					default: '',
// 			// 				},
// 			// 				{
// 			// 					displayName: 'Description',
// 			// 					name: 'ioc_description',
// 			// 					description: 'Markdown supported in cases',
// 			// 					type: 'string',
// 			// 					default: '',
// 			// 				},
// 			// 				...types.iocTLP,
// 			// 				{
// 			// 					displayName: 'Type Name or ID',
// 			// 					name: 'ioc_type_id',
// 			// 					required: true,
// 			// 					type: 'options',
// 			// 					description:
// 			// 						'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
// 			// 					typeOptions: {
// 			// 						loadOptionsMethod: 'getIOCTypes',
// 			// 					},
// 			// 					default: '',
// 			// 				},
// 			// 				{
// 			// 					displayName: 'Tags',
// 			// 					name: 'ioc_tags',
// 			// 					type: 'string',
// 			// 					default: '',
// 			// 					description: 'Comma-separated list of tag names',
// 			// 				},
// 			// 				{
// 			// 					displayName: 'Enrichment',
// 			// 					name: 'ioc_enrichment',
// 			// 					type: 'json',
// 			// 					default: '{}',
// 			// 					description: 'JSON Object with additional data',
// 			// 				},
// 			// 			],
// 			// 		},
// 			// 	],
// 			// },
// 			// {
// 			// 	displayName: 'Add IOCs (JSON)',
// 			// 	name: '__iocsCollectionJSON',
// 			// 	type: 'json',
// 			// 	description: 'Add data as array of IOCs. Will override usual setting.',
// 			// 	default: '{}',
// 			// },
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
// 				displayName: 'Alert Context',
// 				name: 'alertContextType',
// 				type: 'options',
// 				options: [
// 					{
// 						name: 'Using Fields Below',
// 						value: 'keypair',
// 					},
// 					{
// 						name: 'Using JSON',
// 						value: 'json',
// 					},
// 				],
// 				default: 'keypair',
// 			},
// 			{
// 				displayName: 'Alert Context JSON',
// 				name: 'alertContextJSON',
// 				type: 'json',
// 				displayOptions: {
// 					show: {
// 						alertContextType: ['json'],
// 					},
// 				},
// 				default: '{}',
// 			},
// 			{
// 				displayName: 'Alert Context Key Value',
// 				name: 'alertContextKV',
// 				type: 'fixedCollection',
// 				displayOptions: {
// 					show: {
// 						alertContextType: ['keypair'],
// 					},
// 				},
// 				typeOptions: {
// 					multipleValues: true,
// 				},
// 				placeholder: 'Add context field',
// 				default: {
// 					parameters: [],
// 				},
// 				options: [
// 					{
// 						name: 'parameters',
// 						displayName: 'Parameter',
// 						values: [
// 							{
// 								displayName: 'Name',
// 								name: 'name',
// 								type: 'string',
// 								default: '',
// 							},
// 							{
// 								displayName: 'Value',
// 								name: 'value',
// 								type: 'string',
// 								default: '',
// 							},
// 						],
// 					},
// 				],
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
// 				displayName: 'Alert Note',
// 				name: 'alert_note',
// 				type: 'string',
// 				default: '',
// 				description: 'Note of the alert (Summary)',
// 			},
// 			...types.alertResolutionStatus,
// 			...types.alertSeverity,
// 			{
// 				displayName: 'Alert Source',
// 				name: 'alert_source',
// 				type: 'string',
// 				default: '',
// 				description: 'Source of the alert (where it comes from)',
// 			},
// 			{
// 				displayName: 'Alert Source Content',
// 				name: 'alert_source_content',
// 				type: 'json',
// 				default: '{}',
// 				description: 'JSON of the source content (raw event)',
// 			},
// 			{
// 				displayName: 'Alert Source Event Time',
// 				name: 'alert_source_event_time',
// 				type: 'dateTime',
// 				default: `${new Date().toISOString().split('.')[0]}`,
// 				description: 'Time of the Event in UTC according to RFC',
// 				hint: 'e.g. 2023-03-26T03:00:30',
// 			},
// 			{
// 				displayName: 'Alert Source Link',
// 				name: 'alert_source_link',
// 				type: 'string',
// 				default: '',
// 				description: 'Link to the source',
// 			},
// 			{
// 				displayName: 'Alert Source Reference',
// 				name: 'alert_source_ref',
// 				type: 'string',
// 				default: '',
// 				description: 'Reference to the source. Usually it is a unique ID.',
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
// 		options: [
// 			{
// 				displayName: 'Replace IOCs and Assets',
// 				name: 'sendEmptyFields',
// 				type: 'boolean',
// 				default: false,
// 				description:
// 					'Whether to replace IOC/Asset from the alert. If the "IOC value/Asset name" is empty, then removes it from the alert. Otherwise will ignore empty fields.',
// 			},
// 			...types.returnRaw,
// 			...types.fieldProperties(types.alertFields),
// 		],
// 	},
// ];

// const displayOptions = {
// 	show: {
// 		resource: ['alert'],
// 		operation: ['update'],
// 	},
// };

// export const description = updateDisplayOptions(displayOptions, properties);

// export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
// 	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
// 	let response: INodeExecutionData[];
// 	let body: IDataObject = {};
// 	const alertId = this.getNodeParameter('id', i) as string;

// 	utils.addAdditionalFields.call(this, body, i);
// 	const kvUI = this.getNodeParameter(
// 		'alertContextKV.parameters',
// 		i,
// 		null,
// 	) as INodePropertyOptions[];
// 	const jsUI = this.getNodeParameter('alertContextJSON', i, null) as string;

// 	const sendEmpty = this.getNodeParameter('options.sendEmptyFields', i, false) as boolean;

// 	if (kvUI !== null && kvUI.length > 0) {
// 		body.alert_context = Object.fromEntries(
// 			kvUI.map((p: INodePropertyOptions) => [p.name, p.value]),
// 		);
// 	} else if (jsUI !== null) {
// 		try {
// 			body.alert_context = JSON.parse(jsUI);
// 		} catch {
// 			throw new NodeOperationError(this.getNode(), 'JSON parameter need to be an valid JSON', {
// 				itemIndex: i,
// 			});
// 		}
// 	}

// 	const options = this.getNodeParameter('options', i, {});

// 	// let iocs = this.getNodeParameter('additionalFields.__iocsCollection.iocData', i, null) as Array<IIOC>;
// 	let assets = this.getNodeParameter(
// 		'additionalFields.__assetsCollection.assetData',
// 		i,
// 		null,
// 	) as Array<IAsset>;

// 	// let iocsJSON = this.getNodeParameter('additionalFields.__iocsCollectionJSON', i, null) as Array<IIOC>;
// 	let assetsJSON = this.getNodeParameter(
// 		'additionalFields.__assetsCollectionJSON',
// 		i,
// 		null,
// 	) as Array<IAsset>;

// 	// if (iocsJSON !== null)
// 	// 	iocs = iocsJSON

// 	if (assetsJSON !== null) assets = assetsJSON;

// 	// if (sendEmpty && !iocs) iocs = [];
// 	if (sendEmpty && !assets) assets = [];

// 	// if (iocs !== null)
// 	// 	body.alert_iocs = iocs

// 	if (assets !== null) body.alert_assets = assets;

// 	let alertResponse: object;
// 	if ((body.alert_iocs || body.alert_assets) && !sendEmpty) {
// 		try {
// 			alertResponse = await apiRequest.call(this, 'GET', `alerts/${alertId}`, {}, {});
// 		} catch {
// 			throw new NodeOperationError(this.getNode(), `Cannot fetch alert with id: ${alertId}`);
// 		}
// 		if ('data' in alertResponse) {
// 			let alertData = (alertResponse as any).data as IAlert;

// 			if (body.alert_iocs && 'iocs' in alertData) {
// 				(body.alert_iocs as Array<object>).push(...(alertData.iocs as Array<IIOC>));
// 			}
// 			if (body.alert_assets && 'assets' in alertData) {
// 				(body.alert_assets as Array<object>).push(...(alertData.assets as Array<IAsset>));
// 			}
// 		}
// 	}

// 	response = await apiRequest.call(this, 'POST', `${endpoint}/update/${alertId}`, body, query);

// 	const isRaw = (options.isRaw as boolean) || false;
// 	let responseModified = response as any;

// 	// field remover
// 	if (options.hasOwnProperty('fields'))
// 		responseModified.data = utils.fieldsRemover(responseModified.data, options);
// 	if (!isRaw) responseModified = responseModified.data;

// 	const executionData = this.helpers.constructExecutionMetaData(
// 		this.helpers.returnJsonArray(responseModified as IDataObject[]),
// 		{ itemData: { item: i } },
// 	);

// 	return executionData;
// }

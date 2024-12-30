import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodePropertyOptions,
} from 'n8n-workflow';

import type { IIOC, IAsset } from '../../helpers/types';

import { updateDisplayOptions, NodeOperationError } from 'n8n-workflow';

import { endpoint } from './Alert.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';

const properties: INodeProperties[] = [
	{
		displayName: 'Alert Customer Name or ID',
		name: 'alert_customer_id',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getCustomers',
		},
		default: '',
		required: true,
	},
	...types.alertSeverity,
	...types.alertStatus,
	{
		displayName: 'Alert Title',
		name: 'alert_title',
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
			// Asset
			{
				displayName: 'Add Assets',
				name: '__assetsCollection',
				type: 'fixedCollection',
				placeholder: 'Add Asset',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'assetData',
						displayName: 'Asset',
						values: [
							{
								displayName: 'Name',
								name: 'asset_name',
								type: 'string',
								required: true,
								default: '',
							},
							{
								displayName: 'Value',
								description: 'Markdown supported in cases',
								name: 'asset_description',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type Name or ID',
								name: 'asset_type_id',
								required: true,
								type: 'options',
								description:
									'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
								typeOptions: {
									loadOptionsMethod: 'getAssetTypes',
								},
								default: '',
							},
							{
								displayName: 'IP',
								name: 'asset_ip',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Domain',
								name: 'asset_domain',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Tags',
								name: 'asset_tags',
								type: 'string',
								default: '',
								description: 'Comma-separated list of tag names',
							},
							{
								displayName: 'Enrichment',
								name: 'asset_enrichment',
								type: 'json',
								default: '{}',
								description: 'JSON Object with additional data',
							},
						],
					},
				],
			},
			{
				displayName: 'Add Assets (JSON)',
				name: '__assetsCollectionJSON',
				type: 'json',
				description: 'Add data as array of assets. Will override usual setting.',
				default: '{}',
			},
			// IOC
			{
				displayName: 'Add IOCs',
				name: '__iocsCollection',
				type: 'fixedCollection',
				placeholder: 'Add IOC',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'iocData',
						displayName: 'IOC',
						values: [
							{
								displayName: 'Value',
								name: 'ioc_value',
								required: true,
								type: 'string',
								default: '',
							},
							{
								displayName: 'Description',
								name: 'ioc_description',
								description: 'Markdown supported in cases',
								type: 'string',
								default: '',
							},
							...types.iocTLP,
							{
								displayName: 'Type Name or ID',
								name: 'ioc_type_id',
								required: true,
								type: 'options',
								description:
									'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
								typeOptions: {
									loadOptionsMethod: 'getIOCTypes',
								},
								default: '',
							},
							{
								displayName: 'Tags',
								name: 'ioc_tags',
								type: 'string',
								default: '',
								description: 'Comma-separated list of tag names',
							},
							{
								displayName: 'Enrichment',
								name: 'ioc_enrichment',
								type: 'json',
								default: '{}',
								description: 'JSON Object with additional data',
							},
						],
					},
				],
			},
			{
				displayName: 'Add IOCs (JSON)',
				name: '__iocsCollectionJSON',
				type: 'json',
				description: 'Add data as array of IOCs. Will override usual setting.',
				default: '{}',
			},
			{
				displayName: 'Alert Classification Name or ID',
				name: 'alert_classification_id',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getAlertClassifications',
				},
				default: '',
			},
			{
				displayName: 'Alert Context',
				name: 'alertContextType',
				type: 'options',
				options: [
					{
						name: 'Using Fields Below',
						value: 'keypair',
					},
					{
						name: 'Using JSON',
						value: 'json',
					},
				],
				default: 'keypair',
			},
			{
				displayName: 'Alert Context JSON',
				name: 'alertContextJSON',
				type: 'json',
				displayOptions: {
					show: {
						alertContextType: ['json'],
					},
				},
				default: '{}',
			},
			{
				displayName: 'Alert Context Key Value',
				name: 'alertContextKV',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						alertContextType: ['keypair'],
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add context field',
				default: {
					parameters: [],
				},
				options: [
					{
						name: 'parameters',
						displayName: 'Parameter',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Alert Description',
				name: 'alert_description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
			},
			{
				displayName: 'Alert Note',
				name: 'alert_note',
				type: 'string',
				default: '',
				description: 'Note of the alert (Summary)',
			},
			...types.alertResolutionStatus,
			{
				displayName: 'Alert Source',
				name: 'alert_source',
				type: 'string',
				default: '',
				description: 'Source of the alert (where it comes from)',
			},
			{
				displayName: 'Alert Source Content',
				name: 'alert_source_content',
				type: 'json',
				default: '{}',
				description: 'JSON of the source content (raw event)',
			},
			{
				displayName: 'Alert Source Event Time',
				name: 'alert_source_event_time',
				type: 'dateTime',
				default: `${new Date().toISOString().split('.')[0]}`,
				description: 'Time of the Event in UTC according to RFC',
				hint: 'e.g. 2023-03-26T03:00:30',
			},
			{
				displayName: 'Alert Source Link',
				name: 'alert_source_link',
				type: 'string',
				default: '',
				description: 'Link to the source',
			},
			{
				displayName: 'Alert Source Reference',
				name: 'alert_source_ref',
				type: 'string',
				default: '',
				description: 'Reference to the source. Usually it is a unique ID.',
			},
			{
				displayName: 'Alert Tags',
				name: 'alert_tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tag names',
			},
		],
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw, ...types.fieldProperties(types.alertFields)],
	},
];

const displayOptions = {
	show: {
		resource: ['alert'],
		operation: ['create'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	body.alert_title = this.getNodeParameter('alert_title', i) as string;
	body.alert_customer_id = this.getNodeParameter('alert_customer_id', i) as number;
	body.alert_severity_id = this.getNodeParameter('alert_severity_id', i) as number;
	body.alert_status_id = this.getNodeParameter('alert_status_id', i) as number;

	utils.addAdditionalFields.call(this, body, i);

	let kvUI = this.getNodeParameter('alertContextKV.parameters', i, null) as INodePropertyOptions[];
	let jsUI = this.getNodeParameter('alertContextJSON', i, null) as string;

	if (kvUI !== null && kvUI.length > 0) {
		body.alert_context = Object.fromEntries(
			kvUI.map((p: INodePropertyOptions) => [p.name, p.value]),
		);
	} else if (jsUI !== null) {
		try {
			body.alert_context = JSON.parse(jsUI);
		} catch {
			throw new NodeOperationError(this.getNode(), 'JSON parameter need to be an valid JSON', {
				itemIndex: i,
			});
		}
	}

	let iocs = this.getNodeParameter(
		'additionalFields.__iocsCollection.iocData',
		i,
		null,
	) as Array<IIOC>;
	let assets = this.getNodeParameter(
		'additionalFields.__assetsCollection.assetData',
		i,
		null,
	) as Array<IAsset>;

	let iocsJSON = this.getNodeParameter(
		'additionalFields.__iocsCollectionJSON',
		i,
		null,
	) as Array<IIOC>;
	let assetsJSON = this.getNodeParameter(
		'additionalFields.__assetsCollectionJSON',
		i,
		null,
	) as Array<IAsset>;

	if (iocsJSON !== null) iocs = iocsJSON;

	if (assetsJSON !== null) assets = assetsJSON;

	if (iocs !== null) body.alert_iocs = iocs;

	if (assets !== null) body.alert_assets = assets;

	response = await apiRequest.call(this, 'POST', `${endpoint}/add`, body, query);

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

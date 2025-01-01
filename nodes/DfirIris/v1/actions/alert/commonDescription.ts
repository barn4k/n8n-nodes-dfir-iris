import type { INodeProperties } from 'n8n-workflow';
import * as asset from './../asset/commonDescription'
import * as ioc from './../ioc/commonDescription'

export const alertId: INodeProperties =
{
	displayName: 'Alert ID',
	name: 'alert_id',
	type: 'string',
	default: '',
	required: true,
}

export const alertStatus: INodeProperties =
	{
		displayName: 'Alert Status',
		name: 'alert_status_id',
		type: 'options',
		options: [
			{
				name: 'Unspecified',
				value: 1,
			},
			{
				name: 'New',
				value: 2,
			},
			{
				name: 'Assigned',
				value: 3,
			},
			{
				name: 'In Progress',
				value: 4,
			},
			{
				name: 'Pending',
				value: 5,
			},
			{
				name: 'Closed',
				value: 6,
			},
			{
				name: 'Merged',
				value: 7,
			},
			{
				name: 'Escalated',
				value: 8,
			},
		],
		default: 1,
	}

export const alertSeverity: INodeProperties =
	{
		displayName: 'Alert Severity',
		name: 'alert_severity_id',
		type: 'options',
		options: [
			{
				name: 'Low',
				value: 1,
			},
			{
				name: 'Medium',
				value: 2,
			},
			{
				name: 'High',
				value: 3,
			},
			{
				name: 'Critical',
				value: 4,
			},
		],
		default: 2,
	}

export const alertResolutionStatus: INodeProperties =
	{
		displayName: 'Alert Resolution Status',
		name: 'alert_resolution_status_id',
		type: 'options',
		options: [
			{
				name: 'False Positive',
				value: 1,
			},
			{
				name: 'True Positive With Impact',
				value: 2,
			},
			{
				name: 'True Positive Without Impact',
				value: 3,
			},
			{
				name: 'Not Applicable',
				value: 4,
			},
			{
				name: 'Unknown',
				value: 5,
			},
		],
		default: 5,
	}

export const alertIds: INodeProperties =
	{
		displayName: 'Alert IDs',
		name: 'alert_ids',
		type: 'string',
		description: 'Comma-separated list of alert IDs',
		placeholder: '1,2,3',
		default: '-1',
	}

export const alertClassification: INodeProperties =
	{
		displayName: 'Alert Classification Name or ID',
		name: 'alert_classification_id',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getCaseClassifications',
		},
		default: '',
	}

export const alertContextProps: INodeProperties[] = [
	{
		displayName: 'Alert Context',
		name: '__alertContextType',
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
		name: '__alertContextJSON',
		type: 'json',
		displayOptions: {
			show: {
				__alertContextType: ['json'],
			},
		},
		default: '{}',
	},
	{
		displayName: 'Alert Context Key Value',
		name: '__alertContextKV',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				__alertContextType: ['keypair'],
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
];

export const alertCustomer: INodeProperties =
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
	}

export const alertDescription: INodeProperties =
	{
		displayName: 'Alert Description',
		name: 'alert_description',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
	}

	export const alertEndDate: INodeProperties =
	{
		displayName: 'Alert End Date',
		name: 'source_end_date', // should be 'alert_end_date', but it's not working
		type: 'dateTime',
		default: '',
		description:
			'Time of the Event in UTC according to RFC. Works only together with start date.',
		hint: 'e.g. 2023-03-26T03:00:30',
	}

	export const alertStartDate: INodeProperties =
	{
		displayName: 'Alert Start Date',
		name: 'source_start_date', // should be 'alert_start_date', but it's not working
		type: 'dateTime',
		default: '',
		description:
			'Time of the Event in UTC according to RFC. Works only together with end date.',
		hint: 'e.g. 2023-03-26T03:00:30',
	}
export const alertNote: INodeProperties =
	{
		displayName: 'Alert Note',
		name: 'alert_note',
		type: 'string',
		default: '',
		description: 'Note of the alrt',
	}

export const alertSource: INodeProperties = {
	displayName: 'Alert Source',
	name: 'alert_source',
	type: 'string',
	default: '',
	description: 'Source of the alert (where it comes from)',
}

export const alertOwner: INodeProperties = {
	displayName: 'Alert Owner Name or ID',
	name: 'alert_owner_id',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'getUsers',
	},
	options: [],
	default: '',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
}

export const alertSourceProps: INodeProperties[] = [
	alertSource,
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
];

export const alerTags: INodeProperties =
	{
		displayName: 'Alert Tags',
		name: 'alert_tags',
		type: 'string',
		default: '',
		description: 'Comma-separated list of tag names',
	}

export const alerTitle: INodeProperties =
	{
		displayName: 'Alert Title',
		name: 'alert_title',
		type: 'string',
		default: '',
	}

export const alertAssets: INodeProperties = {
	displayName: 'Alert Assets',
	name: 'alert_assets',
	type: 'string',
	default: '',
	description: 'Comma-separated list of Alert Asset IDs',
	placeholder: '1,2,3',
}

export const alertAssetProps: INodeProperties[] = [
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
					asset.assetName,
					asset.assetDescription,
					asset.assetType,
					asset.assetIP,
					asset.assetDomain,
					asset.assetTags,
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
	}
]

export const alertIocs: INodeProperties = {
	displayName: 'Alert IOCs',
	name: 'alert_iocs',
	type: 'string',
	default: '',
	description: 'Comma-separated list of Alert IOC IDs',
	placeholder: '1,2,3',
}

export const alertIocProps: INodeProperties[] = [
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
					ioc.iocValue,
					ioc.iocDescription,
					ioc.iocType,
					ioc.iocTLP,
					ioc.iocTags,
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
]

export const rAlertCustomer: INodeProperties = Object.assign(alertCustomer, {required: true})
export const rAlertSeverity: INodeProperties = Object.assign(alertSeverity, {required: true})
export const rAlertStatus: INodeProperties = Object.assign(alertStatus, {required: true})
export const rAlertTitle: INodeProperties = Object.assign(alerTitle, {required: true})
export const rAlertId: INodeProperties = Object.assign(alertId, {required: true})
export const rAlertIds: INodeProperties = Object.assign(alertIds, {required: true})

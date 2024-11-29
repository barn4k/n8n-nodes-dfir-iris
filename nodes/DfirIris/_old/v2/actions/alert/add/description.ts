// import type { AlertProperties } from '../../Interfaces';

// export const alertAddDescription: AlertProperties = [
// 	{
// 		displayName: 'Alert Title',
// 		name: 'alertTitle',
// 		type: 'string',
// 		default: '',
// 		required: true,
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 	},
// 	{
// 		displayName: 'Alert Description',
// 		name: 'alertDescription',
// 		type: 'string',
// 		typeOptions: {
// 			rows: 4,
// 		},
// 		default: '',
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 	},
// 	{
// 		displayName: 'Alert Source',
// 		name: 'alertSource',
// 		type: 'string',
// 		default: '',
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		description: 'Source of the alert (where it comes from)',
// 	},
// 	{
// 		displayName: 'Alert Source Reference',
// 		name: 'alertSourceRef',
// 		type: 'string',
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		default: '',
// 		description: 'Reference to the source. Usually it is a unique ID.',
// 	},
// 	{
// 		displayName: 'Alert Source Link',
// 		name: 'alertSourceLink',
// 		type: 'string',
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		default: '',
// 		description: 'Link to the source',
// 	},
// 	{
// 		displayName: 'Alert Severity Name or ID',
// 		name: 'alertSeverity',
// 		type: 'options',
// 		required: true,
// 		typeOptions: {
// 			loadOptionsMethod: 'getAlertSeverity',
// 		},
// 		options: [],
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		default: '',
// 		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
// 	},
// 	{
// 		displayName: 'Alert Status Name or ID',
// 		name: 'alertStatus',
// 		required: true,
// 		type: 'options',
// 		typeOptions: {
// 			loadOptionsMethod: 'getAlertStatus',
// 		},
// 		options: [],
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		default: '',
// 		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
// 	},
// 	{
// 		displayName: 'Alert Context',
// 		name: 'alertContextType',
// 		type: 'options',
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		options: [
// 			{
// 				name: "Using Fields Below",
// 				value: "keypair"
// 			},
// 			{
// 				name: "Using JSON",
// 				value: "json"
// 			}
// 		],
// 		default: 'keypair',
// 	},
// 	{
// 		displayName: 'Key Value',
// 		name: 'alertContextKV',
// 		type: 'fixedCollection',
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 				alertContextType: ['keypair'],
// 			},
// 		},
// 		typeOptions: {
// 			multipleValues: true,
// 		},
// 		placeholder: 'Add context field',
// 		default: {
// 			parameters: [],
// 		},
// 		options: [
// 			{
// 				name: 'parameters',
// 				displayName: 'Parameter',
// 				values: [
// 					{
// 						displayName: 'Name',
// 						name: 'name',
// 						type: 'string',
// 						default: '',
// 					},
// 					{
// 						displayName: 'Value',
// 						name: 'value',
// 						type: 'string',
// 						default: '',
// 					},
// 				],
// 			},
// 		],
// 	},
// 	{
// 		displayName: 'JSON',
// 		name: 'alertContextJSON',
// 		type: 'json',
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 				alertContextType: ['json'],
// 			},
// 		},
// 		default: '{}',
// 	},
// 	{
// 		displayName: 'Alert Source Event Time',
// 		name: 'alertSourceEventTime',
// 		type: 'string',
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		default: `${(new Date).toISOString().split(".")[0]}`,
// 		description: 'Time of the Event in UTC according to RFC',
// 		hint: "e.g. 2023-03-26T03:00:30"
// 	},
// 	{
// 		displayName: 'Alert Note',
// 		name: 'alertNote',
// 		type: 'string',
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		default: '',
// 		description: 'Note of the alrt',
// 	},
// 	{
// 		displayName: 'Alert Tags',
// 		name: 'alertTags',
// 		type: 'string',
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		default: '',
// 		description: 'Comma-separated list of tag names',
// 	},
// 	{
// 		displayName: 'Add IOCs',
// 		name: 'useIOCs',
// 		type: 'boolean',
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		default: false,
// 		description: 'Whether to add IOC',
// 	},
// 	{
// 		displayName: 'IOCs',
// 		name: 'iocsCollection',
// 		type: 'fixedCollection',
// 		placeholder: 'Add IOC',
// 		default: {},
// 		typeOptions: {
// 			multipleValues: true,
// 		},
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 				useIOCs: [true]
// 			},
// 		},
// 		options: [
// 			{
// 				name: 'iocData',
// 				displayName: "IOC",
// 				values: [
// 					{
// 						displayName: "Value",
// 						name: "ioc_value",
// 						required: true,
// 						type: "string",
// 						default: ""
// 					},
// 					{
// 						displayName: "Description",
// 						name: "ioc_description",
// 						description: "Markdown supported in cases",
// 						type: "string",
// 						default: ""
// 					},
// 					{
// 						displayName: "TLP Name or ID",
// 						name: "ioc_tlp_id",
// 						required: true,
// 						type: "options",
// 						description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
// 						typeOptions: {
// 							loadOptionsMethod: 'getIOCTLP',
// 						},
// 						default: ""
// 					},
// 					{
// 						displayName: "Type Name or ID",
// 						name: "ioc_type_id",
// 						required: true,
// 						type: "options",
// 						description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
// 						typeOptions: {
// 							loadOptionsMethod: 'getIOCTypes',
// 						},
// 						default: ""
// 					},
// 					{
// 						displayName: "Tags",
// 						name: "ioc_tags",
// 						type: "string",
// 						default: "",
// 						description: "Comma-separated list of tag names"
// 					},
// 					{
// 						displayName: "Enrichment",
// 						name: "ioc_enrichment",
// 						type: "json",
// 						default: "{}",
// 						description: "JSON Object with additional data"
// 					}

// 				]
// 			}
// 		]

// 	},
// 	{
// 		displayName: 'Assets',
// 		name: 'useAssets',
// 		type: 'boolean',
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		default: false,
// 		description: 'Whether to add Asset',
// 	},
// 	{
// 		displayName: 'Assets',
// 		name: 'assetsCollection',
// 		type: 'fixedCollection',
// 		placeholder: 'Add Asset',
// 		default: {},
// 		typeOptions: {
// 			multipleValues: true,
// 		},
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 				useAssets: [true]
// 			},
// 		},
// 		options: [
// 			{
// 				name: 'assetData',
// 				displayName: "Asset",
// 				values: [
// 					{
// 						displayName: "Name",
// 						name: "asset_name",
// 						type: "string",
// 						required: true,
// 						default: ""
// 					},
// 					{
// 						displayName: "Description",
// 						description: "Markdown supported in cases",
// 						name: "asset_description",
// 						type: "string",
// 						default: ""
// 					},
// 					{
// 						displayName: "Type Name or ID",
// 						name: "asset_type_id",
// 						required: true,
// 						type: "options",
// 						description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
// 						typeOptions: {
// 							loadOptionsMethod: 'getAssetTypes',
// 						},
// 						default: ""
// 					},
// 					{
// 						displayName: "IP",
// 						name: "asset_ip",
// 						type: "string",
// 						default: ""
// 					},
// 					{
// 						displayName: "Domain",
// 						name: "asset_domain",
// 						type: "string",
// 						default: ""
// 					},
// 					{
// 						displayName: "Tags",
// 						name: "asset_tags",
// 						type: "string",
// 						default: "",
// 						description: "Comma-separated list of tag names"
// 					},
// 					{
// 						displayName: "Enrichment",
// 						name: "asset_enrichment",
// 						type: "json",
// 						default: "{}",
// 						description: "JSON Object with additional data"
// 					}

// 				]
// 			}
// 		],
// 	},
// 	{
// 		displayName: 'Alert Customer Name or ID',
// 		name: 'alertCustomer',
// 		type: "options",
// 		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
// 		typeOptions: {
// 			loadOptionsMethod: 'getCustomers',
// 		},
// 		required: true,
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		default: '',
// 	},
// 	{
// 		displayName: 'Alert Source Content',
// 		name: 'alertSourceContent',
// 		type: 'json',
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		default: "{}",
// 		description: 'JSON of the source content (raw event)',
// 	},
// 	{
// 		displayName: 'Options',
// 		name: 'options',
// 		placeholder: 'Add Option',
// 		type: 'collection',
// 		default: {},
// 		displayOptions: {
// 			show: {
// 				operation: ['add'],
// 				resource: ['alert'],
// 			},
// 		},
// 		options: [
// 			{
// 				displayName: 'Return Fields',
// 				name: 'fields',
// 				type: 'string',
// 				description: 'List of comma-separated fields. add (!) in the beginning to exclude fields (e.g. !alert_id,alert_status). Wilcards (*) supported',
// 				default: '',
// 			}
// 		]
// 	},
// ];

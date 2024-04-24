import type { AlertProperties } from '../../Interfaces';

export const alertUpdateDescription: AlertProperties = [
	{
		displayName: 'Alert ID',
		name: 'alertId',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['alert'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		placeholder: 'Add Field',
		type: 'collection',
		default: {},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['alert'],
			},
		},
		options: [
			{
				displayName: 'Alert Title',
				name: 'alertTitle',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Alert Description',
				name: 'alertDescription',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
			},
			{
				displayName: 'Alert Source',
				name: 'alertSource',
				type: 'string',
				default: '',
				description: 'Source of the alert (where it comes from)',
			},
			{
				displayName: 'Alert Source Reference',
				name: 'alertSourceRef',
				type: 'string',
				default: '',
				description: 'Reference to the source. Usually it is a unique ID.',
			},
			{
				displayName: 'Alert Source Link',
				name: 'alertSourceLink',
				type: 'string',
				default: '',
				description: 'Link to the source',
			},
			{
				displayName: 'Alert Severity Name or ID',
				name: 'alertSeverity',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAlertSeverity',
				},
				options: [],
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
			},
			{
				displayName: 'Alert Status Name or ID',
				name: 'alertStatus',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAlertStatus',
				},
				options: [],
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
			},
			{
				displayName: 'Alert Context (Key Value)',
				name: 'alertContextKV',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add context field',
				default: {},
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
				displayName: 'Alert Context (JSON)',
				name: 'alertContextJSON',
				type: 'json',
				default: '{}',
			},
			{
				displayName: 'Alert Source Event Time',
				name: 'alertSourceEventTime',
				type: 'string',
				default: '',
				description: 'Time of the Event in UTC according to RFC',
				hint: "e.g. 2023-03-26T03:00:30"
			},
			{
				displayName: 'Alert Note',
				name: 'alertNote',
				type: 'string',
				default: '',
				description: 'Note of the alrt',
			},
			{
				displayName: 'Alert Tags',
				name: 'alertTags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tag names',
			},
			{
				displayName: 'Add IOCs',
				name: 'iocsCollection',
				type: 'fixedCollection',
				placeholder: 'Add IOC',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'iocData',
						displayName: "IOC",
						values: [
							{
								displayName: "Value",
								name: "ioc_value",
								required: true,
								type: "string",
								default: ""
							},
							{
								displayName: "Description",
								name: "ioc_description",
								description: "Markdown supported in cases",
								type: "string",
								default: ""
							},
							{
								displayName: "TLP Name or ID",
								name: "ioc_tlp_id",
								required: true,
								type: "options",
								description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
								typeOptions: {
									loadOptionsMethod: 'getIOCTLP',
								},
								default: ""
							},
							{
								displayName: "Type Name or ID",
								name: "ioc_type_id",
								required: true,
								type: "options",
								description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
								typeOptions: {
									loadOptionsMethod: 'getIOCTypes',
								},
								default: ""
							},
							{
								displayName: "Tags",
								name: "ioc_tags",
								type: "string",
								default: "",
								description: "Comma-separated list of tag names"
							},
							{
								displayName: "Enrichment",
								name: "ioc_enrichment",
								type: "json",
								default: "{}",
								description: "JSON Object with additional data"
							}

						]
					}
				]
			},
			{
				displayName: 'Add Assets',
				name: 'assetsCollection',
				type: 'fixedCollection',
				placeholder: 'Add Asset',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						useAssets: [true]
					},
				},
				options: [
					{
						name: 'assetData',
						displayName: "Asset",
						values: [
							{
								displayName: "Name",
								name: "asset_name",
								type: "string",
								required: true,
								default: ""
							},
							{
								displayName: "Description",
								description: "Markdown supported in cases",
								name: "asset_description",
								type: "string",
								default: ""
							},
							{
								displayName: "Type Name or ID",
								name: "asset_type_id",
								required: true,
								type: "options",
								description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
								typeOptions: {
									loadOptionsMethod: 'getAssetTypes',
								},
								default: ""
							},
							{
								displayName: "IP",
								name: "asset_ip",
								type: "string",
								default: ""
							},
							{
								displayName: "Domain",
								name: "asset_domain",
								type: "string",
								default: ""
							},
							{
								displayName: "Tags",
								name: "asset_tags",
								type: "string",
								default: "",
								description: "Comma-separated list of tag names"
							},
							{
								displayName: "Enrichment",
								name: "asset_enrichment",
								type: "json",
								default: "{}",
								description: "JSON Object with additional data"
							}

						]
					}
				],
			},
			{
				displayName: 'Alert Customer Name or ID',
				name: 'alertCustomer',
				type: "options",
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getCustomers',
				},
				default: '',
			},
			{
				displayName: 'Alert Source Content',
				name: 'alertSourceContent',
				type: 'json',
				default: "{}",
				description: 'JSON of the source content (raw event)',
			},
		]
	},
	{
		displayName: 'Options',
		name: 'options',
		placeholder: 'Add Option',
		type: 'collection',
		default: {},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['alert'],
			},
		},
		options: [
			{
				displayName: 'Return Fields',
				name: 'fields',
				type: 'string',
				description: 'List of comma-separated fields. add (!) in the beginning to exclude fields (e.g. !alert_id,alert_status). Wilcards (*) supported',
				default: '',
			},
			{
				displayName: 'Replace Alert IOCs',
				name: 'replaceIOCs',
				type: 'boolean',
				displayOptions: {
					show: {
						iocsCollection: [true]
					},
				},
				default: false,
				description: 'Whether to remove all current Alert IOCs',
			},
			{
				displayName: 'Replace Alert Assets',
				name: 'replaceAssets',
				type: 'boolean',
				displayOptions: {
					show: {
						assetsCollection: [true]
					},
				},
				default: false,
				description: 'Whether to remove all current Alert Assets',
			},
		]
	},
];

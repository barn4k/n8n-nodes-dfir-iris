import type { INodeProperties } from 'n8n-workflow';

import {
	returnRaw,
	fieldProperties
} from '../../helpers/types';

const fields: string[] = [
	"asset_enrichment",
	"asset_type",
	"asset_type_id",
	"case_id",
	"asset_description",
	"asset_id",
	"analysis_status_id",
	"custom_attributes",
	"asset_info",
	"user_id",
	"date_added",
	"date_update",
	"asset_name",
	"asset_ip",
	"asset_tags",
	"asset_compromise_status_id",
	"asset_uuid",
	"asset_domain",
	"linked_ioc",
]

const thisRes = 'asset'

export const resource: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [thisRes],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'create',
				description: 'Create new asset',
				action: 'Add new asset',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an asset',
				action: 'Update an asset',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'get an asset',
				action: 'Get an asset',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get multiple assets',
				action: 'Get multiple assets',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an asset',
				action: 'Delete an asset',
			},
		],
		default: 'get',
	},

]

export const operations: INodeProperties[] = [

	// ----------------------------------
	//         asset:get
	// ----------------------------------

	{
		displayName: 'Asset Id',
		name: 'assetId',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'get',
					'update',
					'delete'
				],
				resource: [thisRes],
			},
		},
		required: true,
		description: 'Asset Id',
	},

	// ----------------------------------
	//         asset:create/update
	// ----------------------------------

	{
		displayName: 'Asset Type',
		name: 'assetType',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAssetTypes'
		},
		default: '',
		displayOptions: {
			show: {
				operation: [
					'create',
					'update',
				],
				resource: [thisRes],
			},
		},
		required: true,
		description: 'Asset Name',
	},
	{
		displayName: 'Asset Name',
		name: 'assetName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'create',
					'update',
				],
				resource: [thisRes],
			},
		},
		required: true,
		description:
			'Asset Name',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['create', 'update'],
				resource: [thisRes],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Asset Domain',
				name: 'asset_domain',
				type: 'string',
				default: '',
				description: 'Asset Domain',
			},
			{
				displayName: 'Asset IP',
				name: 'asset_ip',
				type: 'string',
				default: '',
				description: 'Asset IP',
			},
			{
				displayName: 'Asset Info',
				name: 'asset_info',
				type: 'string',
				default: '',
				description: 'Asset Info',
			},
			{
				displayName: 'Asset Compromise Status',
				name: 'asset_compromise_status_id',
				type: 'options',
				options: [
					{value: 0, name: "To be determined"},
					{value: 1, name: "Compromised"},
					{value: 2, name: "Not compromised"},
					{value: 3, name: "Unknown"},
				],
				default: '',
				description: 'Asset Compromise Status',
			},
			{
				displayName: 'Asset Analysis Status',
				name: 'analysis_status_id',
				type: 'options',
				options: [
					{value: 1, name: "Unspecified"},
					{value: 2, name: "To be done"},
					{value: 3, name: "Started"},
					{value: 4, name: "Pending"},
					{value: 5, name: "Canceled"},
					{value: 6, name: "Done"},
				],
				default: '',
				description: 'Asset Compromise Status',
			},
			{
				displayName: 'IOC References',
				name: 'ioc_links',
				placeholder: 'Add IOC Reference',
				type: 'multiOptions',
				typeOptions: {
					// multipleValues: true,
					loadOptionsMethod: "getIOCs"
				},
				default: '',
				description: 'Related IOCs',
			},
			{
				displayName: 'Asset Tags',
				name: 'asset_tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
			},
			{
				displayName: 'Asset Description',
				name: 'asset_description',
				type: 'string',
				default: '',
				description: 'Asset Description',
			},
			{
				displayName: 'Custom Attributes',
				name: 'custom_attributes',
				type: 'json',
				default: 0,
				description: 'Add custom attributes',
			},
		],
	},

	// ----------------------------------
	//         asset:options
	// ----------------------------------

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				operation: [
					'get',
					'create',
					'update'
				],
				resource: [thisRes],
			},
		},
		default: {},
		options: [
			...returnRaw,
			...fieldProperties(fields),
		],
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				operation: ['getMany'],
				resource: [thisRes],
			},
		},
		default: {},
		options: [
			...returnRaw,
		],
	},
]

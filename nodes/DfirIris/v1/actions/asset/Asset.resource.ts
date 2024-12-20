import type { INodeProperties } from 'n8n-workflow';

import * as create from './create.operation';
import * as deleteAsset from './deleteAsset.operation';
import * as get from './get.operation';
import * as getAll from './getAll.operation';
import * as update from './update.operation';

export { create, deleteAsset, get, getAll, update };

export const endpoint = 'case/assets';

export const resource: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['asset'],
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
				name: 'Delete',
				value: 'deleteAsset',
				description: 'Delete an asset',
				action: 'Delete an asset',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an asset',
				action: 'Get an asset',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get multiple assets',
				action: 'Get multiple assets',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an asset',
				action: 'Update an asset',
			},
		],
		default: 'getAll',
	},
	...create.description,
	...deleteAsset.description,
	...get.description,
	...getAll.description,
	...update.description,
];

// export const operations: INodeProperties[] = [
// 	// ----------------------------------
// 	//         asset:get
// 	// ----------------------------------

// 	{
// 		displayName: 'Asset ID',
// 		name: 'assetId',
// 		type: 'number',
// 		default: '',
// 		displayOptions: {
// 			show: {
// 				operation: ['get', 'update', 'delete'],
// 				resource: [thisRes],
// 			},
// 		},
// 		required: true,
// 	},

// 	// ----------------------------------
// 	//         asset:create/update
// 	// ----------------------------------

// 	{
// 		displayName: 'Asset Type Name or ID',
// 		name: 'assetType',
// 		type: 'options',
// 		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
// 		typeOptions: {
// 			loadOptionsMethod: 'getAssetTypes',
// 		},
// 		default: '',
// 		displayOptions: {
// 			show: {
// 				operation: ['create', 'update'],
// 				resource: [thisRes],
// 			},
// 		},
// 		required: true,
// 	},
// 	{
// 		displayName: 'Asset Name',
// 		name: 'assetName',
// 		type: 'string',
// 		default: '',
// 		displayOptions: {
// 			show: {
// 				operation: ['create', 'update'],
// 				resource: [thisRes],
// 			},
// 		},
// 		required: true,
// 	},
// 	{
// 		displayName: 'Additional Fields',
// 		name: 'additionalFields',
// 		type: 'collection',
// 		placeholder: 'Add Field',
// 		displayOptions: {
// 			show: {
// 				operation: ['create', 'update'],
// 				resource: [thisRes],
// 			},
// 		},
// 		default: {},
// 		options: [
// 			{
// 				displayName: 'Asset Domain',
// 				name: 'asset_domain',
// 				type: 'string',
// 				default: '',
// 			},
// 			{
// 				displayName: 'Asset IP',
// 				name: 'asset_ip',
// 				type: 'string',
// 				default: '',
// 			},
// 			{
// 				displayName: 'Asset Info',
// 				name: 'asset_info',
// 				type: 'string',
// 				default: '',
// 			},
// 			{
// 				displayName: 'Asset Compromise Status',
// 				name: 'asset_compromise_status_id',
// 				type: 'options',
// 				options: [
// 					{ value: 0, name: 'To Be Determined' },
// 					{ value: 1, name: 'Compromised' },
// 					{ value: 2, name: 'Not Compromised' },
// 					{ value: 3, name: 'Unknown' },
// 				],
// 				default: 0,
// 			},
// 			{
// 				displayName: 'Asset Analysis Status',
// 				name: 'analysis_status_id',
// 				type: 'options',
// 				options: [
// 					{ value: 1, name: 'Unspecified' },
// 					{ value: 2, name: 'To Be Done' },
// 					{ value: 3, name: 'Started' },
// 					{ value: 4, name: 'Pending' },
// 					{ value: 5, name: 'Canceled' },
// 					{ value: 6, name: 'Done' },
// 				],
// 				default: 1,
// 				description: 'Asset Compromise Status',
// 			},
// 			{
// 				displayName: 'IOC Reference Names or IDs',
// 				name: 'ioc_links',
// 				placeholder: 'Add IOC Reference',
// 				type: 'multiOptions',
// 				typeOptions: {
// 					// multipleValues: true,
// 					loadOptionsMethod: 'getIOCs',
// 				},
// 				default: [],
// 				description: 'Related IOCs. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
// 			},
// 			{
// 				displayName: 'Asset Tags',
// 				name: 'asset_tags',
// 				type: 'string',
// 				default: '',
// 				description: 'Comma-separated list of tags',
// 			},
// 			{
// 				displayName: 'Asset Description',
// 				name: 'asset_description',
// 				type: 'string',
// 				default: '',
// 			},
// 			{
// 				displayName: 'Custom Attributes',
// 				name: 'custom_attributes',
// 				type: 'json',
// 				default: 0,
// 				description: 'Add custom attributes',
// 			},
// 		],
// 	},

// 	// ----------------------------------
// 	//         asset:options
// 	// ----------------------------------

// 	{
// 		displayName: 'Options',
// 		name: 'options',
// 		type: 'collection',
// 		placeholder: 'Add Option',
// 		displayOptions: {
// 			show: {
// 				operation: ['get', 'create', 'update'],
// 				resource: [thisRes],
// 			},
// 		},
// 		default: {},
// 		options: [...returnRaw, ...fieldProperties(fields)],
// 	},

// 	{
// 		displayName: 'Options',
// 		name: 'options',
// 		type: 'collection',
// 		placeholder: 'Add Option',
// 		displayOptions: {
// 			show: {
// 				operation: ['getMany'],
// 				resource: [thisRes],
// 			},
// 		},
// 		default: {},
// 		options: [...returnRaw],
// 	},
// ];

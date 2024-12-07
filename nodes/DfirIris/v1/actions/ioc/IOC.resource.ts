import type { INodeProperties } from 'n8n-workflow';

import {
	returnRaw,
	fieldProperties
} from '../../helpers/types';

const fields: string[] = [
	"ioc_description",
	"ioc_value",
	"ioc_type",
	"ioc_tags",
	"ioc_uuid",
	"ioc_enrichment",
	"ioc_id",
	"ioc_tlp_id",
	"user_id",
	"custom_attributes",
	"ioc_type_id",
	"ioc_misp"
]

const fieldsShort = [
	"ioc_type_id",
	"ioc_tlp_id",
	"ioc_value",
	"ioc_description",
	"ioc_tags",
	"custom_attributes"
]

const thisRes = 'ioc'

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
				description: `Create new ${thisRes}`,
				action: `Add new ${thisRes}`,
			},
			{
				name: 'Update',
				value: 'update',
				description: `Update ${thisRes}`,
				action: `Update ${thisRes}`,
			},
			{
				name: 'Get',
				value: 'get',
				description: `Get ${thisRes}`,
				action: `Get ${thisRes}`,
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: `Get multiple ${thisRes}`,
				action: `Get multiple ${thisRes}`,
			},
			{
				name: 'Delete',
				value: 'delete',
				description: `Delete ${thisRes}`,
				action: `Delete ${thisRes}`,
			},
		],
		default: 'get',
	},

]

export const operations: INodeProperties[] = [

	// ----------------------------------
	//         ioc:get
	// ----------------------------------

	{
		displayName: 'IOC Id',
		name: 'iocId',
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
		description: 'IOC Id',
	},

	// ----------------------------------
	//         ioc:create/update
	// ----------------------------------

	{
		displayName: 'IOC Type',
		name: 'type',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getIOCTypes'
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
		description: 'IOC Type',
	},
	{
		displayName: 'IOC Description',
		name: 'description',
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
			'IOC Description',
	},
	{
		displayName: 'IOC Value',
		name: 'value',
		type: 'string',
		default: '',
		// validateType: 'string',
		// ignoreValidationDuringExecution: true,
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
			'IOC Value',
	},
	{
		displayName: 'IOC TLP',
		name: 'tlpId',
		type: 'options',
		options: [
			{value: 1, name: "Red"},
			{value: 2, name: "Amber"},
			{value: 3, name: "Green"},
			{value: 4, name: "Clear"},
			{value: 5, name: "Amber strict"},
		],
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
			'IOC Name',
	},
	{
		displayName: 'IOC Tags',
		name: 'tags',
		type: 'string',
		validateType: 'string',
		ignoreValidationDuringExecution: true,
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
			'IOC Tags, comma separated',
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
				displayName: 'Custom Attributes',
				name: 'custom_attributes',
				type: 'json',
				default: 0,
				description: 'Add custom attributes',
			},
		],
	},

	// ----------------------------------
	//         ioc:options
	// ----------------------------------

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				operation: [
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
				operation: ['getMany', 'get'],
				resource: [thisRes],
			},
		},
		default: {},
		options: [
			...returnRaw,
			...fieldProperties(fieldsShort),
		],
	},
]

import type { INodeProperties } from 'n8n-workflow';

import * as create from './create.operation';
import * as deleteIOC from './deleteIOC.operation';
import * as get from './get.operation';
import * as getAll from './getAll.operation';
import * as update from './update.operation';

export { create, deleteIOC, get, getAll, update };

export const endpoint = 'case/ioc';

const thisRes = 'IOC';

export const resource: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ioc'],
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
				value: 'getAll',
				description: `Get multiple ${thisRes}`,
				action: `Get multiple ${thisRes}`,
			},
			{
				name: 'Delete',
				value: 'deleteIOC',
				description: `Delete ${thisRes}`,
				action: `Delete ${thisRes}`,
			},
		],
		default: 'getAll',
	},
	...create.description,
	...deleteIOC.description,
	...get.description,
	...getAll.description,
	...update.description,
];

// export const operations: INodeProperties[] = [
// 	// ----------------------------------
// 	//         ioc:get
// 	// ----------------------------------

// 	{
// 		displayName: 'IOC ID',
// 		name: 'iocId',
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
// 	//         ioc:create/update
// 	// ----------------------------------

// 	{
// 		displayName: 'IOC Type Name or ID',
// 		name: 'type',
// 		type: 'options',
// 		description:
// 			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
// 		typeOptions: {
// 			loadOptionsMethod: 'getIOCTypes',
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
// 		displayName: 'IOC Description',
// 		name: 'description',
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
// 		displayName: 'IOC Value',
// 		name: 'value',
// 		type: 'string',
// 		default: '',
// 		// validateType: 'string',
// 		// ignoreValidationDuringExecution: true,
// 		displayOptions: {
// 			show: {
// 				operation: ['create', 'update'],
// 				resource: [thisRes],
// 			},
// 		},
// 		required: true,
// 	},
// 	{
// 		displayName: 'IOC TLP',
// 		name: 'tlpId',
// 		type: 'options',
// 		options: [
// 			{ value: 1, name: 'Red' },
// 			{ value: 2, name: 'Amber' },
// 			{ value: 3, name: 'Green' },
// 			{ value: 4, name: 'Clear' },
// 			{ value: 5, name: 'Amber Strict' },
// 		],
// 		default: 1,
// 		displayOptions: {
// 			show: {
// 				operation: ['create', 'update'],
// 				resource: [thisRes],
// 			},
// 		},
// 		required: true,
// 		description: 'IOC Name',
// 	},
// 	{
// 		displayName: 'IOC Tags',
// 		name: 'tags',
// 		type: 'string',
// 		validateType: 'string',
// 		ignoreValidationDuringExecution: true,
// 		default: '',
// 		displayOptions: {
// 			show: {
// 				operation: ['create', 'update'],
// 				resource: [thisRes],
// 			},
// 		},
// 		required: true,
// 		description: 'IOC Tags, comma-separated',
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
// 				displayName: 'Custom Attributes',
// 				name: 'custom_attributes',
// 				type: 'json',
// 				default: 0,
// 				description: 'Add custom attributes',
// 			},
// 		],
// 	},

// 	// ----------------------------------
// 	//         ioc:options
// 	// ----------------------------------

// 	{
// 		displayName: 'Options',
// 		name: 'options',
// 		type: 'collection',
// 		placeholder: 'Add Option',
// 		displayOptions: {
// 			show: {
// 				operation: ['create', 'update'],
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
// 				operation: ['getMany', 'get'],
// 				resource: [thisRes],
// 			},
// 		},
// 		default: {},
// 		options: [...returnRaw, ...fieldProperties(fieldsShort)],
// 	},
// ];

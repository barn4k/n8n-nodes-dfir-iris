import type { INodeProperties } from 'n8n-workflow';

import { returnRaw, taskStatuses } from './types';

import { fieldProperties,  } from './GenericFunctions';

export const taskTypes: string[] = [
	"task_open_date",
	"task_userid_close",
	"task_last_update",
	"task_userid_update",
	"task_assignees",
	"task_title",
	"task_uuid",
	"task_tags",
	"id",
	"task_description",
	"task_userid_open",
	"custom_attributes",
	"task_status_id",
	"task_close_date",
	"task_case_id",
	"modification_history",
]

export const taskTypesShort: string[] = [
	"id",
	"task_assignees_id",
	"task_status_id",
	"task_title",
	"task_description",
	"task_tags",
	"custom_attributes",
]

const thisRes = 'task'

export const taskFields: INodeProperties[] = [
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
				description: 'Create new task',
				action: 'Add new task',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a task',
				action: 'Update a task',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'get a task',
				action: 'Get a task',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get multiple tasks',
				action: 'Get multiple tasks',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a task',
				action: 'Delete a task',
			},
		],
		default: 'get',
	},

]

export const taskTypeFields: INodeProperties[] = [

	// ----------------------------------
	//         task:get
	// ----------------------------------

	{
		displayName: 'Task Id',
		name: 'taskId',
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
		description: 'Task Id',
	},

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: [thisRes],
			},
		},
		default: {},
		options: [
			...returnRaw,
			...fieldProperties(taskTypes),
		],
	},

	// ----------------------------------
	//         task:getMany
	// ----------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
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

	// ----------------------------------
	//         task:create/update
	// ----------------------------------

	{
		displayName: 'Task Title',
		name: 'title',
		type: 'string',
		default: 'Unnamed',
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
		description: 'Task Title',
	},
	{
		displayName: 'Task Assignee',
		name: 'assignee',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUsers',
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
		description:
			'To whom assign a task',
	},
	{
		displayName: 'Task Status',
		name: 'status',
		type: 'options',
		default: '',
		options: taskStatuses,
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
			'Task Status',
	},

	// ----------------------------------
	//         task:create
	// ----------------------------------

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: [thisRes],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Task Description',
				name: 'task_description',
				type: 'string',
				default: '',
				description: 'Task Description',
			},
			{
				displayName: 'Task Tags',
				name: 'task_tags',
				type: 'string',
				default: '',
				description: 'Task tags as comma separated string',
			},
			{
				displayName: 'Custom Attributes',
				name: 'custom_attributes',
				type: 'json',
				default: 0,
				description: 'Add custom attributes',
			},
			...returnRaw,
			...fieldProperties(taskTypesShort),
		],
	},


	// ----------------------------------
	//         task:update
	// ----------------------------------

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['update'],
				resource: [thisRes],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Task Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Task Description',
			},
			{
				displayName: 'Task Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Task tags as comma separated string',
			},
			{
				displayName: 'Custom Attributes',
				name: 'custom_attributes',
				type: 'json',
				default: 0,
				description: 'Add custom attributes',
			},
			...returnRaw,
			...fieldProperties(taskTypesShort),
		],
	},

]

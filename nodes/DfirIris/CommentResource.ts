import type { INodeProperties } from 'n8n-workflow';

import { returnRaw } from './types';

import { fieldProperties } from './GenericFunctions';

export const commentTypes: string[] = [
	"comment_date",
	"comment_id",
	"comment_text",
	"comment_update_date",
	"comment_uuid",
	"name",
	"user",
]

const thisRes = 'comment'

export const commentFields: INodeProperties[] = [
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
				description: 'Add new comment',
				action: 'Add new comment',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a comment',
				action: 'Update a comment',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get comments',
				action: 'Get comments',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a comment',
				action: 'Delete a comment',
			},
		],
		default: 'getMany',
	},

]

export const commentTypeFields: INodeProperties[] = [

	// ----------------------------------
	//         comment
	// ----------------------------------

	{
		displayName: 'Object Name',
		name: 'objectName',
		type: 'options',
		default: '',
		options: [
			{
				name: 'Assets',
				value: 'assets'
			},
			{
				name: 'Evidences',
				value: 'evidences'
			},
			{
				name: 'Events',
				value: 'events'
			},
			{
				name: 'IOC',
				value: 'ioc'
			},
			{
				name: 'Notes',
				value: 'notes'
			},
			{
				name: 'Tasks',
				value: 'tasks'
			},
		],
		displayOptions: {
			show: {
				resource: [thisRes],
			},
		},
		required: true,
		description:
			'Add a new comment to a case object',
	},
	{
		displayName: 'Object Id',
		name: 'objectId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: [thisRes],
			},
		},
		required: true,
		description:
			'Case object Id',
	},
	{
		displayName: 'Comment Id',
		name: 'commentId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				operation: [
					'update',
					'delete',
				],
				resource: [thisRes],
			},
		},
		required: true,
		description:
			'Case comment Id',
	},
	{
		displayName: 'Comment Text',
		name: 'commentText',
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
			'Case comment Id',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
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
			{
				displayName: 'Comment Text',
				name: 'comment_text',
				type: 'string',
				default: '',
				description: 'Comment Text',
			},
			...returnRaw,
			...fieldProperties(commentTypes),
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: [
					'getMany'
				],
				resource: [thisRes],
			},
		},
		default: {},
		options: [
			...fieldProperties(commentTypes),
		],
	},
]

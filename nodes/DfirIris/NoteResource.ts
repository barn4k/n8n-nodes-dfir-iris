import type { INodeProperties } from 'n8n-workflow';

import {
	returnRaw,
	// noteFields,
	// noteFieldsShort,
	// returnAllOrLimit,
} from './types';

import {
	fieldProperties,
	// getPropertyName
} from './GenericFunctions';

export const noteTypes: string[] = [
	"directory",
	"note_id",
	"note_uuid",
	"note_title",
	"note_content",
	"note_user",
	"note_creationdate",
	"note_lastupdate",
	"note_case_id",
	"custom_attributes",
	"directory_id",
	"modification_history",
	"comments"
]

export const noteTypesShort: string[] = [
	"note_id",
	"note_title",
	"note_content",
	"custom_attributes",
]

const thisRes = 'note'

export const noteFields: INodeProperties[] = [
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
				description: 'Add new note',
				action: 'Add new note',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a note',
				action: 'Update a note',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'get a note',
				action: 'Get a note',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get multiple notes',
				action: 'Get multiple notes',
			},
			{
				name: 'Search in Notes',
				value: 'search',
				description: 'Search across notes',
				action: 'Search across notes',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a note',
				action: 'Delete a note',
			},
			{
				name: 'Add Note Group',
				value: 'addNoteGroup',
				description: 'Create new note group',
				action: 'Create new note group',
			},
			{
				name: 'Delete Note Group',
				value: 'deleteNoteGroup',
				description: 'Delete note group with all notes',
				action: 'Delete note group',
			},
		],
		default: 'get',
	},

]

export const noteTypeFields: INodeProperties[] = [

	// ----------------------------------
	//         note:get
	// ----------------------------------

	{
		displayName: 'Note Id',
		name: 'noteId',
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
		description:
			'Note Id',
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
			...fieldProperties(noteTypes),
		],
	},

	// ----------------------------------
	//         note:getMany
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
	//         note:create/update
	// ----------------------------------

	{
		displayName: 'Note Title',
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
		description:
			'Note Title',
	},
	{
		displayName: 'Note Content',
		name: 'content',
		type: 'string',
		default: 'No Content',
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
			'Note Content',
	},

	// ----------------------------------
	//         note:create
	// ----------------------------------

	{
		displayName: 'Note Group Id',
		name: 'directoryId',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				operation: [
					'create',
					'deleteNoteGroup'
				],
				resource: [thisRes],
			},
		},
		required: true,
		description:
			'Note Group Id',
	},
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
			...returnRaw,
			...fieldProperties(noteTypesShort),
		],
	},

	// ----------------------------------
	//         note:addNoteGroup
	// ----------------------------------

	{
		displayName: 'Group Name',
		name: 'directoryName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['addNoteGroup'],
				resource: [thisRes],
			},
		},
		required: true,
		description:
			'Note Group Id',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['addNoteGroup'],
				resource: [thisRes],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Parent Note Group Id',
				name: 'parent_id',
				type: 'number',
				default: '',
				description:
					'Parent Note Group Id',
			},
			...returnRaw,
		],
	},

	// ----------------------------------
	//         note:update
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
				displayName: 'Note Group Id',
				name: 'directory_id',
				type: 'number',
				default: 0,
				description: 'Note Group Id',
			},
			{
				displayName: 'Custom Attributes',
				name: 'custom_attributes',
				type: 'json',
				// typeOptions: {
				// 	minValue: 0,
				// },
				default: 0,
				description: 'Add custom attributes',
			},
			...returnRaw,
			...fieldProperties(noteTypesShort),
		],
	},

	// ----------------------------------
	//         note:search
	// ----------------------------------

	{
		displayName: 'Search Input',
		name: 'search',
		type: 'string',
		description: 'Use a % as wildcard',
		displayOptions: {
			show: {
				operation: ['search'],
				resource: [thisRes],
			},
		},
		default: "",
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['search'],
				resource: [thisRes],
			},
		},
		default: {},
		options: [
			...returnRaw,
			...fieldProperties(noteTypes),
		],
	},
]

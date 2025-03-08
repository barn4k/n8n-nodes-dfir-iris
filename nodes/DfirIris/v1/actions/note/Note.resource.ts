import type { INodeProperties } from 'n8n-workflow';

import * as create from './create.operation';
import * as deleteNote from './deleteNote.operation';
import * as search from './search.operation';
import * as get from './get.operation';
import * as update from './update.operation';

export { create, deleteNote, get, search, update };

export const endpoint = 'case/notes';

const thisRes = 'note';

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
				description: 'Add new note',
				action: 'Add new note',
			},
			{
				name: 'Delete',
				value: 'deleteNote',
				description: 'Delete a note',
				action: 'Delete a note',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a note',
				action: 'Get a note',
			},
			{
				name: 'Search in Notes',
				value: 'search',
				description: 'Search across notes',
				action: 'Search across notes',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a note',
				action: 'Update a note',
			},
		],
		default: 'get',
	},
	...create.description,
	...deleteNote.description,
	...get.description,
	...search.description,
	...update.description,
];

import type { INodeProperties } from 'n8n-workflow';

import * as create from './create.operation';
import * as deleteNoteDirectory from './deleteNoteDirectory.operation';
import * as getAll from './getAll.operation';
import * as update from './update.operation';

export { create, deleteNoteDirectory, getAll, update };

export const endpoint = 'case/notes/directories';

const thisRes = 'noteDirectory';

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
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many note groups and notes',
			},
			{
				name: 'Add Note Group',
				value: 'create',
				action: 'Create new note group',
			},
			{
				name: 'Delete Note Group',
				value: 'deleteNoteDirectory',
				description: 'Delete note group with all notes',
				action: 'Delete note group',
			},
			{
				name: 'Update Note Group',
				value: 'update',
				action: 'Update note group',
			},
		],
		default: 'getAll',
	},
	...create.description,
	...deleteNoteDirectory.description,
	...getAll.description,
	...update.description,
];

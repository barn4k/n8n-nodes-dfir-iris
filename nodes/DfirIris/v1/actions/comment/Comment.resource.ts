import type { INodeProperties } from 'n8n-workflow';

import * as create from './create.operation';
import * as deleteComment from './deleteComment.operation';
import * as getAll from './getAll.operation';
import * as update from './update.operation';

export { create, deleteComment, getAll, update };

const thisRes = 'comment';

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
				value: 'getAll',
				description: 'Get comments',
				action: 'Get comments',
			},
			{
				name: 'Delete',
				value: 'deleteComment',
				description: 'Delete a comment',
				action: 'Delete a comment',
			},
		],
		default: 'getAll',
	},
	...create.description,
	...deleteComment.description,
	...getAll.description,
	...update.description,
];

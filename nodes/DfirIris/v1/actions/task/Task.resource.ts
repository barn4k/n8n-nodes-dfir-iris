import type { INodeProperties } from 'n8n-workflow';

import * as create from './create.operation';
import * as deleteTask from './deleteTask.operation';
import * as get from './get.operation';
import * as getAll from './getAll.operation';
import * as update from './update.operation';

export { create, deleteTask, get, getAll, update };

export const endpoint = 'case/tasks';

const thisRes = 'task';

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
				value: 'getAll',
				description: `Get multiple ${thisRes}`,
				action: `Get multiple ${thisRes}`,
			},
			{
				name: 'Delete',
				value: 'deleteTask',
				description: `Delete ${thisRes}`,
				action: `Delete ${thisRes}`,
			},
		],
		default: 'getAll',
	},
	...create.description,
	...deleteTask.description,
	...get.description,
	...getAll.description,
	...update.description,
];

import type { INodeProperties } from 'n8n-workflow';

import * as callModule from './callModule.operation';
import * as listTasks from './listTasks.operation';

export { callModule, listTasks };

export const resource: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['module'],
			},
		},
		options: [
			{
				name: 'Call',
				value: 'callModule',
				description: 'Manually call a module',
				action: 'Call a module',
			},
			{
				name: 'List Module Tasks',
				value: 'listTasks',
				action: 'List module tasks',
			},
		],
		default: 'callModule',
	},
	...callModule.description,
	...listTasks.description,
];

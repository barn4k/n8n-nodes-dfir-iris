import type { INodeProperties } from 'n8n-workflow';
import * as add from './add';
// import * as del from './del';

// export { create, del as delete };
export { add };

export const descriptions: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['alert'],
			},
		},
		options: [
			{
				name: 'Add Alert',
				value: 'add',
				description: 'Add a new Alert',
				action: 'Add a new alert',
			},
			// {
			// 	name: 'Create',
			// 	value: 'create',
			// 	description: 'Create a new channel',
			// 	action: 'Create a channel',
			// },
			// {
			// 	name: 'Delete',
			// 	value: 'delete',
			// 	description: 'Soft delete a channel',
			// 	action: 'Delete a channel',
			// }
		],
		default: 'add',
	},
	...add.description,
	// ...del.description,
	// ...members.description,
];

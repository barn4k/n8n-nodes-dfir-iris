/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import type { INodeTypeDescription } from 'n8n-workflow';
import * as alert from './alert';
// import * as message from './message';
// import * as reaction from './reaction';
// import * as user from './user';

export const versionDescription: INodeTypeDescription = {
	displayName: 'DFIR IRIS',
	name: 'dfirIris',
	icon: 'file:iris.svg',
	group: ['output'],
	version: 202,
	subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
	description: 'works with DFIR IRIS IRP',
	defaults: {
		name: 'dfirIris',
	},
	inputs: ['main'],
	outputs: ['main'],
	credentials: [
		{
			name: 'dfirIrisApi',
			required: true,
		},
	],
	properties: [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Alert',
					value: 'alert',
				},
				// {
				// 	name: 'Message',
				// 	value: 'message',
				// },
				// {
				// 	name: 'Reaction',
				// 	value: 'reaction',
				// },
				// {
				// 	name: 'User',
				// 	value: 'user',
				// },
			],
			default: 'alert',
		},
		...alert.descriptions,
		// ...message.descriptions,
		// ...reaction.descriptions,
		// ...user.descriptions,
	],
};

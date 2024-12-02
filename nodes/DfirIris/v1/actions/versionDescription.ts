import {
	NodeConnectionType,
	type INodeTypeDescription,
	// BINARY_ENCODING
} from 'n8n-workflow';

import * as note from './note/Note.resource'
import * as task from './task/Task.resource'
import * as comment from './comment/Comment.resource'
import * as asset from './asset/Asset.resource'

export const versionDescription: INodeTypeDescription = {
	displayName: 'DFIR IRIS',
	name: 'dfirIris',
	icon: 'file:iris.svg',
	group: ['input'],
	version: [1],
	subtitle: '={{ $parameter["resource"] + ": " + $parameter["operation"] }}',
	description: 'works with DFIR IRIS IRP',
	defaults: {
		name: 'DFIR IRIS',
	},
	// usableAsTool: true,
	inputs: [NodeConnectionType.Main],
	outputs: [NodeConnectionType.Main],
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
				// {
				// 	name: 'Alert',
				// 	value: 'alert',
				// },
				{
					name: 'Asset',
					value: 'asset',
				},
				// {
				// 	name: 'IOC',
				// 	value: 'ioc',
				// },
				// {
				// 	name: 'Case',
				// 	value: 'case',
				// },
				// {
				// 	name: 'Datastore',
				// 	value: 'datastore',
				// },
				{
					name: 'Note',
					value: 'note',
				},
				{
					name: 'Task',
					value: 'task',
				},
				{
					name: 'Comment',
					value: 'comment',
				},
			],
			default: 'note',
		},
		...note.resource,
		...task.resource,
		...comment.resource,
		...asset.resource,

		{
			displayName: 'Case Id',
			name: 'cid',
			type: 'number',
			default: 1,
			displayOptions: {
				show: {
					// operation: [
					// 	'get',
					// ],
					// resource: [
					// 	'note',
					// 	'task',
					// 	'comment',
					// 	'asset',
					// 	'alert',
					// 	'alert',
					// 	],
				},
			},
			required: true,
			description:
				'Case Id',
		},

		...note.operations,
		...task.operations,
		...comment.operations,
		...asset.operations,
	]
}

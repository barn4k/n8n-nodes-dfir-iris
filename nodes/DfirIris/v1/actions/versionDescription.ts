/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import { NodeConnectionTypes, type INodeTypeDescription } from 'n8n-workflow';

import * as alert from './alert/Alert.resource';
import * as asset from './asset/Asset.resource';
import * as icase from './case/Case.resource';
import * as comment from './comment/Comment.resource';
import * as datastoreFile from './datastoreFile/DatastoreFile.resource';
import * as datastoreFolder from './datastoreFolder/DatastoreFolder.resource';
import * as evidence from './evidence/Evidence.resource';
import * as ioc from './ioc/IOC.resource';
import * as iModule from './module/Module.resource';
import * as note from './note/Note.resource';
import * as noteDirectory from './noteDirectory/NoteDirectory.resource';
import * as task from './task/Task.resource';
import * as manage from './manage/Manage.resource';
import * as timeline from './timeline/Timeline.resource';

import { cidDescription } from '../helpers/types';

export const versionDescription: INodeTypeDescription = {
	displayName: 'DFIR IRIS',
	name: 'dfirIris',
	group: ['input'],
	version: [1, 1.1],
	subtitle: '={{ $parameter["resource"] + ": " + $parameter["operation"] }}',
	description: 'works with DFIR IRIS IRP',
	defaults: {
		name: 'DFIR IRIS',
	},
	inputs: [NodeConnectionTypes.Main],
	outputs: [NodeConnectionTypes.Main],
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
				{
					name: 'Asset',
					value: 'asset',
				},
				{
					name: 'Case',
					value: 'case',
				},
				{
					name: 'Comment',
					value: 'comment',
				},
				{
					name: 'Datastore File',
					value: 'datastoreFile',
				},
				{
					name: 'Datastore Folder',
					value: 'datastoreFolder',
				},
				{
					name: 'Evidence',
					value: 'evidence',
					displayOptions: {
						hide: {
							'@version': [1],
						},
					},
				},
				{
					name: 'IOC',
					value: 'ioc',
				},
				{
					name: "Manage Metadata",
					value: 'manage',
					displayOptions: {
						hide: {
							'@version': [1],
						},
					},
				},
				{
					name: 'Module',
					value: 'module',
				},
				{
					name: 'Note',
					value: 'note',
				},
				{
					name: 'Note Group',
					value: 'noteDirectory',
				},
				{
					name: 'Task',
					value: 'task',
				},
				{
					name: 'Timeline',
					value: 'timeline',
					displayOptions: {
						hide: {
							'@version': [1],
						},
					},
				},
			],
			default: 'datastoreFolder',
		},
		...cidDescription,
		...alert.resource,
		...asset.resource,
		...icase.resource,
		...comment.resource,
		...datastoreFile.resource,
		...datastoreFolder.resource,
		...evidence.resource,
		...ioc.resource,
		...iModule.resource,
		...manage.resource,
		...note.resource,
		...noteDirectory.resource,
		...task.resource,
		...timeline.resource,
	],
};

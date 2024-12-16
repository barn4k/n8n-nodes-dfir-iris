import type { INodeProperties } from 'n8n-workflow';

import * as getTree from './getTree.operation';

import * as addFolder from './addFolder.operation'
import * as moveFolder from './moveFolder.operation'
import * as renameFolder from './renameFolder.operation'
import * as deleteFolder from './deleteFolder.operation'

export { getTree, addFolder, moveFolder, renameFolder, deleteFolder }

// import { cidDescription } from '../../helpers/types';

export const endpoint = 'datastore';

export const resource: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['datastoreFolder'],
			},
		},
		options: [
			{
				name: 'Get Datastore Tree',
				value: 'getTree',
				action: `Get Datastore Tree`,
			},

			{
				name: 'Add Folder',
				value: 'addFolder',
				action: `Add Folder`,
			},
			{
				name: 'Rename Folder',
				value: 'renameFolder',
				action: `Rename Folder`,
			},
			{
				name: 'Move Folder',
				value: 'moveFolder',
				action: `Move Folder`,
			},
			{
				name: 'Delete Folder',
				value: 'deleteFolder',
				action: `Delete Folder and all child items`,
			},
		],
		default: 'getTree',
	},
	// ...cidDescription,
	...getTree.description,

	...addFolder.description,
	...moveFolder.description,
	...renameFolder.description,
	...deleteFolder.description,
];

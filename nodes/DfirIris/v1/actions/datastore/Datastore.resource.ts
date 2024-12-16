import type { INodeProperties } from 'n8n-workflow';

// general
import * as getTree from './getTree.operation';

// file
import * as uploadFile from './uploadFile.operation';
import * as updateFileInfo from './updateFileInfo.operation'
import * as getFileInfo from './getFileInfo.operation'
import * as downloadFile from './downloadFile.operation'
import * as moveFile from './moveFile.operation'
import * as deleteFile from './deleteFile.operation'

export { getTree, uploadFile, getFileInfo, updateFileInfo, downloadFile, moveFile, deleteFile }

// folder
import * as addFolder from './addFolder.operation'
import * as moveFolder from './moveFolder.operation'
import * as renameFolder from './renameFolder.operation'
import * as deleteFolder from './deleteFolder.operation'

export { addFolder, moveFolder, renameFolder, deleteFolder }

import { cidDescription } from '../../helpers/types';

export const endpoint = 'datastore';

export const resource: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['datastore'],
			},
		},
		options: [
			// ----------------------------------
			//           General
			// ----------------------------------
			{
				name: 'Get Datastore Tree',
				value: 'getTree',
				action: `Get Datastore Tree`,
			},

			// ----------------------------------
			//           File Operations
			// ----------------------------------
			{
				name: 'Upload File',
				value: 'uploadFile',
				description: 'Add new File',
				action: `Add new File`,
			},
			{
				name: 'Get File Info',
				value: 'getFileInfo',
				action: `Get File Info`,
			},
			{
				name: 'Update File Info',
				value: 'updateFileInfo',
				action: `Update File Info`,
			},
			{
				name: 'Download File',
				value: 'downloadFile',
				action: `Download File`,
			},
			{
				name: 'Delete File',
				value: 'deleteFile',
				action: `Delete File`,
			},
			{
				name: 'Move File',
				value: 'moveFile',
				action: `Move File`,
			},

			// ----------------------------------
			//        Folder Operations
			// ----------------------------------

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
	...cidDescription,
	...getTree.description,
	...uploadFile.description,
	...getFileInfo.description,
	...updateFileInfo.description,
	...downloadFile.description,
	...moveFile.description,
	...deleteFile.description,

	...addFolder.description,
	...moveFolder.description,
	...renameFolder.description,
	...deleteFolder.description,
];

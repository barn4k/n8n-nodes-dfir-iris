import type { INodeProperties } from 'n8n-workflow';

import * as uploadFile from './uploadFile.operation';
import * as updateFileInfo from './updateFileInfo.operation'
import * as getFileInfo from './getFileInfo.operation'
import * as downloadFile from './downloadFile.operation'
import * as moveFile from './moveFile.operation'
import * as deleteFile from './deleteFile.operation'

export { uploadFile, getFileInfo, updateFileInfo, downloadFile, moveFile, deleteFile }

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
				resource: ['datastoreFile'],
			},
		},
		options: [
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
		],
		default: 'uploadFile',
	},
	// ...cidDescription,
	...uploadFile.description,
	...getFileInfo.description,
	...updateFileInfo.description,
	...downloadFile.description,
	...moveFile.description,
	...deleteFile.description,
];

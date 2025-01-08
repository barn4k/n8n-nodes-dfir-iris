import type { INodeProperties } from 'n8n-workflow';

import * as create from './create.operation';
import * as deleteAsset from './deleteAsset.operation';
import * as get from './get.operation';
import * as getAll from './getAll.operation';
import * as update from './update.operation';

export { create, deleteAsset, get, getAll, update };

export const endpoint = 'case/assets';

export const resource: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['asset'],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'create',
				description: 'Create new asset',
				action: 'Add new asset',
			},
			{
				name: 'Delete',
				value: 'deleteAsset',
				description: 'Delete an asset',
				action: 'Delete an asset',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an asset',
				action: 'Get an asset',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get multiple assets',
				action: 'Get multiple assets',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an asset',
				action: 'Update an asset',
			},
		],
		default: 'getAll',
	},
	...create.description,
	...deleteAsset.description,
	...get.description,
	...getAll.description,
	...update.description,
];

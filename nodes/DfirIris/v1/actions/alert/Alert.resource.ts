import type { INodeProperties } from 'n8n-workflow';

import * as create from './create.operation';
import * as deleteAlert from './deleteAlert.operation';
import * as get from './get.operation';
import * as getRelations from './getRelations.operation';
import * as filterAlerts from './filterAlerts.operation';
import * as update from './update.operation';
import * as countAlerts from './countAlerts.operation';
import * as batchUpdate from './batchUpdate.operation';
import * as batchDelete from './batchDelete.operation';
import * as escalate from './escalate.operation';
import * as merge from './merge.operation';
import * as unmerge from './unmerge.operation';

export {
	create,
	deleteAlert,
	get,
	getRelations,
	filterAlerts,
	update,
	countAlerts,
	batchUpdate,
	batchDelete,
	escalate,
	merge,
	unmerge,
};

export const endpoint = 'alerts';

const thisRes = 'Alert';

export const resource: INodeProperties[] = [
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
				name: 'Add',
				value: 'create',
				description: `Create new ${thisRes}`,
				action: `Add new ${thisRes}`,
			},
			{
				name: 'Batch Delete',
				value: 'batchDelete',
				description: `Delete multiple ${thisRes}s`,
				action: `Delete multiple ${thisRes}s`,
			},
			{
				name: 'Batch Update',
				value: 'batchUpdate',
				description: `Update multiple ${thisRes}s`,
				action: `Update multiple ${thisRes}s`,
			},
			{
				name: 'Count Alerts',
				value: 'countAlerts',
				description: `Get amount of ${thisRes}s`,
				action: `Get amount of ${thisRes}s`,
			},
			{
				name: 'Delete',
				value: 'deleteAlert',
				description: `Delete ${thisRes}`,
				action: `Delete ${thisRes}`,
			},
			{
				name: 'Filter Alerts',
				value: 'filterAlerts',
				description: `Filter ${thisRes}s`,
				action: `Filter ${thisRes}s`,
			},
			{
				name: 'Get',
				value: 'get',
				description: `Get ${thisRes}`,
				action: `Get ${thisRes}`,
			},
			{
				name: 'Get Relations',
				value: 'getRelations',
				description: 'Get Similiar Entitites Relevant to the Alert',
				action: `Get Alert Relations`,
			},
			{
				name: 'Escalate',
				value: 'escalate',
				description: `Escalate ${thisRes} to a case`,
				action: `Escalate ${thisRes}`,
			},
			{
				name: 'Merge',
				value: 'merge',
				description: `Link ${thisRes} to an existing case`,
				action: `Merge ${thisRes}`,
			},
			{
				name: 'Unmerge',
				value: 'unmerge',
				description: `Unlink ${thisRes} from a cse`,
				action: `Unmerge ${thisRes}`,
			},
			{
				name: 'Update',
				value: 'update',
				description: `Update ${thisRes}`,
				action: `Update ${thisRes}`,
			},
		],
		default: 'countAlerts',
	},
	...create.description,
	...deleteAlert.description,
	...get.description,
	...getRelations.description,
	...update.description,
	...filterAlerts.description,
	...countAlerts.description,
	...batchUpdate.description,
	...batchDelete.description,
	...escalate.description,
	...merge.description,
	...unmerge.description,
];

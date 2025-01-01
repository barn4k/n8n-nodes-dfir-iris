import type { INodeProperties } from 'n8n-workflow';

import * as create from './create.operation';
import * as deleteCase from './deleteCase.operation';
import * as get from './get.operation';
// import * as filterCases from './filterCases.operation';
// import * as update from './update.operation';
// import * as countCases from './countCases.operation';

// export { create, deleteCase, get, filterCases, update, countCases };

export const endpoint = 'manage/cases';

const thisRes = 'Case';

export const resource: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['case'],
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
				name: 'Update',
				value: 'update',
				description: `Update ${thisRes}`,
				action: `Update ${thisRes}`,
			},
			{
				name: 'Update Summary',
				value: 'updateSummary',
				description: `Update ${thisRes} Summary`,
				action: `Update ${thisRes} Summary`,
			},
			{
				name: 'Get',
				value: 'get',
				description: `Get ${thisRes} summary`,
				action: `Get ${thisRes} summary`,
			},
			{
				name: 'Count Cases',
				value: 'countCases',
				description: `Get amount of ${thisRes}s`,
				action: `Get amount of ${thisRes}s`,
			},
			{
				name: 'Delete',
				value: 'deleteCase',
				description: `Delete ${thisRes}`,
				action: `Delete ${thisRes}`,
			},
			{
				name: 'Filter Cases',
				value: 'filterCases',
				description: `Filter ${thisRes}s`,
				action: `Filter ${thisRes}s`,
			},
			{
				name: 'Export',
				value: 'exportCases',
				description: `Export ${thisRes} as JSON`,
				action: `Export ${thisRes} as JSON`,
			},
		],
		default: 'get',
	},
	...create.description,
	...deleteCase.description,
	...get.description,
	// ...update.description,
	// ...filterCases.description,
	// ...countCases.description,
	// ...exportCase.description,
	// ...updateSummary.description,
];

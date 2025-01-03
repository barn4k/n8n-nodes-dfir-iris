import type { INodeProperties } from 'n8n-workflow';

import * as create from './create.operation';
import * as deleteCase from './deleteCase.operation';
import * as getSummary from './getSummary.operation';
import * as countCases from './countCases.operation';
import * as filterCases from './filterCases.operation';
import * as update from './update.operation';
import * as updateSummary from './updateSummary.operation';
import * as exportCase from './exportCase.operation';

export {
	create,
	deleteCase,
	getSummary,
	filterCases,
	update,
	updateSummary,
	countCases,
	exportCase,
};

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
				name: 'Export',
				value: 'exportCase',
				description: `Export ${thisRes} as JSON`,
				action: `Export ${thisRes} as JSON`,
			},
			{
				name: 'Filter Cases',
				value: 'filterCases',
				description: `Filter ${thisRes}s`,
				action: `Filter ${thisRes}s`,
			},
			{
				name: 'Get Case Summary',
				value: 'getSummary',
				description: `Get ${thisRes} summary`,
				action: `Get ${thisRes} summary`,
			},
			{
				name: 'Update',
				value: 'update',
				description: `Update ${thisRes}`,
				action: `Update ${thisRes}`,
			},
			{
				name: 'Update Case Summary',
				value: 'updateSummary',
				description: `Update ${thisRes} Summary`,
				action: `Update ${thisRes} Summary`,
			},
		],
		default: 'countCases',
	},
	...countCases.description,
	...create.description,
	...deleteCase.description,
	...exportCase.description,
	...filterCases.description,
	...getSummary.description,
	...update.description,
	...updateSummary.description,
];

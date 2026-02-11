import type { INodeProperties } from 'n8n-workflow';

import * as getAssetTypes from './getAssetTypes.operation';
import * as getCaseCustomers from './getCaseCustomers.operation';
import * as getCaseClassifications from './getCaseClassifications.operation';
import * as getCaseStates from './getCaseStates.operation';
import * as getCaseTemplates from './getCaseTemplates.operation';
import * as getEvidenceTypes from './getEvidenceTypes.operation';
import * as getIOCTypes from './getIOCTypes.operation';
import * as getSeverities from './getSeverities.operation';
import * as getTaskStatuses from './getTaskStatuses.operation';
import * as getUsers from './getUsers.operation';

export { getAssetTypes, getCaseClassifications, getCaseStates, getCaseTemplates, getCaseCustomers, 
	getEvidenceTypes, getIOCTypes, getSeverities, getUsers, getTaskStatuses };
export const resource: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['manage'],
			}
		},
		options: [
			{
				name: 'Get Asset Types',
				value: 'getAssetTypes',
				action: 'Get all asset types',
			},
			{
				name: 'Get Case Classifications',
				value: 'getCaseClassifications',
				action: 'Get all case classifications',
			},
			{
				name: 'Get Case Customers',
				value: 'getCaseCustomers',
				action: 'Get all case customers',
			},
			{
				name: 'Get Case States',
				value: 'getCaseStates',
				action: 'Get all case states',
			},
			{
				name: 'Get Case Templates',
				value: 'getCaseTemplates',
				action: 'Get all case templates',
			},
			{
				name: 'Get Evidence Types',
				value: 'getEvidenceTypes',
				action: 'Get all evidence types',
			},
			{
				name: 'Get IOC Types',
				value: 'getIOCTypes',
				action: 'Get all IOC types',
			},
			{
				name: 'Get Severities',
				value: 'getSeverities',
				action: 'Get all severities',
			},
			{
				name: 'Get Task Statuses',
				value: 'getTaskStatuses',
				action: 'Get all task statuses',
			},
			{
				name: 'Get Users',
				value: 'getUsers',
				action: 'Get all users',
			},
		],
		default: 'getCaseClassifications',
	},
	...getAssetTypes.description,
	...getCaseClassifications.description,
	...getCaseCustomers.description,
	...getCaseStates.description,
	...getCaseTemplates.description,
	...getEvidenceTypes.description,
	...getIOCTypes.description,
	...getSeverities.description,
	...getUsers.description,
	...getTaskStatuses.description,
];

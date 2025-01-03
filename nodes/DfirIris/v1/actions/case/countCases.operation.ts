import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Case.resource';
import { apiRequestAll } from '../../transport';
import { types, utils } from '../../helpers';
import * as icase from './commonDescription';

const properties: INodeProperties[] = [
	{
		displayName: 'Sort',
		name: 'sort',  // not working
		type: 'options',
		required: true,
		options: [
			{ name: 'Ascending', value: 'asc' },
			{ name: 'Descending', value: 'desc' },
		],
		description: 'Sort by alert creation time',
		default: 'asc',
	},
	{
		displayName: 'Filter Options',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			icase.caseIds, // ok
			icase.caseCustomer,
			icase.caseName, // ok
			icase.caseDescription, // ok
			icase.caseClassification, // ok
			icase.caseOwner,// not working
			icase.caseOpeningUser,// ok
			icase.caseSeverity, // not working
			icase.caseState, // not working
			icase.caseSocId,
			icase.caseReviewer, // not working
			icase.caseStatus, // not working
			icase.caseTags, // not working
			icase.caseOpenStartDate, // ok
			icase.caseOpenEndDate, // ok
		],
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw, ...types.fieldProperties(types.caseFields)],
	},
];

const displayOptions = {
	show: {
		resource: ['case'],
		operation: ['countCases'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { sort: 'desc' };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	utils.addAdditionalFields.call(this, body, i);
	console.log('updated body', body);

	Object.assign(query, body);

	response = await apiRequestAll.call(this, 'GET', `${endpoint}/filter`, {}, query, 1, 'cases');

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	let responseModified = response as any;
	console.debug('responseModified', responseModified);

	// field remover
	if (options.hasOwnProperty('fields'))
		responseModified.data.cases = utils.fieldsRemover(responseModified.data.cases, options);

	if (!isRaw) responseModified = { total: responseModified.data?.total || 0 };

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseModified as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

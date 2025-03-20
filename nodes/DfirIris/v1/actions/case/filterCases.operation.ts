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

const fields = [
	'access_level',
	'case_close_date',
	'case_description',
	'case_id',
	'name',
	'case_open_date',
	'case_soc_id',
	'case_uuid',
	'classification',
	'classification_id',
	'client_name',
	'opened_by',
	'opened_by_user_id',
	'owner',
	'owner_id',
	'state_id',
	'state_name',
];

const properties: INodeProperties[] = [
	...types.returnAllOrLimit,
	{
		displayName: 'Sort',
		name: 'sort',
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
			icase.caseIds,							// ok for 2.4.19
			icase.caseCustomerF,				// ok for 2.4.19
			icase.caseName,							// ok for 2.4.19
			icase.caseDescription,			// ok for 2.4.19
			icase.caseClassificationF,  // ok for 2.4.19
			icase.caseOwnerF,						// ok for 2.4.19
			icase.caseOpeningUser,			// ok for 2.4.19
			icase.caseSeverityF,				// ok for 2.4.19
			icase.caseStateF,						// ok for 2.4.19
			icase.caseSocId,
			icase.caseReviewerF,
			// icase.caseStatusF,					// not working for 2.4.19
			// icase.caseTagsF, 					// not working for 2.4.19
			icase.caseOpenStartDate,
			icase.caseOpenEndDate,
		],
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			...types.returnRaw,
			...types.fieldProperties(fields),
			{
				displayName: 'Start Page',
				name: 'startPage',
				type: 'number',
				default: 1,
				description: 'Controls how many entries to skip',
			}
		],
	},
];

const displayOptions = {
	show: {
		resource: ['case'],
		operation: ['filterCases'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: 1 };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	body.sort = this.getNodeParameter('sort', i) as string;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	utils.addAdditionalFields.call(this, body, i);

	console.log('updated body', body);

	Object.assign(query, body);

	response = await apiRequestAll.call(
		this,
		'GET',
		`${endpoint}/filter`,
		{},
		body,
		returnAll ? 0 : (this.getNodeParameter('limit', i) as number),
		this.getNodeParameter('options.startPage', i, 1) as number,
		'cases',
	);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	let responseModified = response as any;

	// field remover
	if (options.hasOwnProperty('fields'))
		responseModified.data.cases = utils.fieldsRemover(responseModified.data.cases, options);

	if (!isRaw) responseModified = responseModified.data.cases;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseModified as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

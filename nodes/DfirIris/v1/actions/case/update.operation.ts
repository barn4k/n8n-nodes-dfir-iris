import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Case.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';
import * as icase from './commonDescription';

const properties: INodeProperties[] = [
	icase.rCaseId,
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			icase.caseName,
			icase.caseSocId,
			icase.caseClassification,
			icase.caseOwner,
			icase.caseReviewer,
			icase.caseState,
			icase.caseStatus,
			icase.caseSeverity,
			icase.caseTags,
			types.customAttributes,
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
		operation: ['update'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = {};
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	utils.addAdditionalFields.call(this, body, i);

	const options = this.getNodeParameter('options', i, {});

	response = await apiRequest.call(
		this,
		'POST',
		(`${endpoint}/update/` + this.getNodeParameter('case_id', i, 0)) as string,
		body,
		query,
	);

	const isRaw = (options.isRaw as boolean) || false;
	let responseModified = response as any;

	// field remover
	if (options.hasOwnProperty('fields'))
		responseModified.data = utils.fieldsRemover(responseModified.data, options);
	if (!isRaw) responseModified = responseModified.data;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseModified as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

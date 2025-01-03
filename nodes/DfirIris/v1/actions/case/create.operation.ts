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
	icase.rCaseSocId,
	icase.rCaseCustomer,
	icase.rCaseName,
	icase.rCaseDescription,
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [icase.caseClassification, types.customAttributes],
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
		operation: ['create'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = {};
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	body.case_soc_id = this.getNodeParameter('case_soc_id', i) as string;
	body.case_customer = this.getNodeParameter('case_customer', i) as number;
	body.case_name = this.getNodeParameter('case_name', i) as number;
	body.case_description = this.getNodeParameter('case_description', i) as number;

	utils.addAdditionalFields.call(this, body, i);

	response = await apiRequest.call(this, 'POST', `${endpoint}/add`, body, query);

	const options = this.getNodeParameter('options', i, {});
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

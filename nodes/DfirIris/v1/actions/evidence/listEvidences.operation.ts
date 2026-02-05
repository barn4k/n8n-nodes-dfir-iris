import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Evidence.resource';
import { apiRequest } from '../../transport';
import { utils, types } from '../../helpers';


const properties: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw, ...types.fieldProperties(types.evidenceFields)],
	},
];

const displayOptions = {
	show: {
		resource: ['evidence'],
		operation: ['listEvidences'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response;
	const body: IDataObject = {};

	response = await apiRequest.call(
		this,
		'GET',
		`${endpoint}/list`,
		body,
		query,
	);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	
	// field remover
	if (Object.prototype.hasOwnProperty.call(options, 'fields') && response.data && typeof response.data === 'object' && 'evidences' in response.data) {
		const data = response.data as IDataObject;
		data.evidences = utils.fieldsRemover((data.evidences as IDataObject[]), options);
	}
	if (!isRaw) response = (response.data as IDataObject).evidences;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

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
import * as local from './commonDescription';

const properties: INodeProperties[] = [
	{ ...local.fileId, required: true },
	{ ...local.fileSize, required: true },
	{ ...local.fileDescription, required: true },
	{ ...local.fileHash, required: true },
	{ ...types.customAttributes, required: true },
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
		operation: ['updateEvidence'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response;
	const body: IDataObject = {};

	body.filename = this.getNodeParameter(local.fileName.name, i) as string;
	body.file_size = this.getNodeParameter(local.fileSize.name, i) as number;
	body.file_description = this.getNodeParameter(local.fileDescription.name, i) as string;
	body.file_hash = this.getNodeParameter(local.fileHash.name, i) as string;
	body.custom_attributes = this.getNodeParameter(types.customAttributes.name, i) as object;

	response = await apiRequest.call(
		this,
		'POST',
		`${endpoint}/update/` + (this.getNodeParameter(local.fileId.name, i) as string),
		body,
		query,
	);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	
	// field remover
	if (Object.prototype.hasOwnProperty.call(options, 'fields'))
		response.data = utils.fieldsRemover((response.data as IDataObject[]), options);
	if (!isRaw) response = response.data;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

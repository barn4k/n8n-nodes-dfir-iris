import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './DatastoreFile.resource'
import { apiRequest } from '../../transport';
import { utils, types } from '../../helpers';


const properties: INodeProperties[] = [
	{
		displayName: 'File Id',
		name: 'fileId',
		type: 'number',
		default: '',
		required: true,
		description: 'File Id',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw],
	},
];

const displayOptions = {
	show: {
		resource: ['datastoreFile'],
		operation: ['deleteFile'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[]
	let body: IDataObject = {}

	response = await apiRequest.call(
		this,
		'POST',
		`${endpoint}/file/delete/` + (this.getNodeParameter('fileId', i) as string),
		body,
		query,
	);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = options.isRaw as boolean || false

	// field remover
	if (options.hasOwnProperty('fields'))
		response = utils.fieldsRemover(response, options)
	if (!isRaw)
		// @ts-ignore
		response = {status: "success"}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

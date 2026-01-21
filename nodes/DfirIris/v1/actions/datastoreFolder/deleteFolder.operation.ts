import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './DatastoreFolder.resource';
import { apiRequest } from '../../transport';
import { utils, types } from '../../helpers';

const properties: INodeProperties[] = [
	{
		displayName: 'Folder Name or ID',
		name: 'folderId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getFolders',
		},
		options: [],
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
		resource: ['datastoreFolder'],
		operation: ['deleteFolder'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response;
	const body: IDataObject = {};

	response = await apiRequest.call(
		this,
		'POST',
		`${endpoint}/folder/delete/` + (this.getNodeParameter('folderId', i) as string),
		body,
		query,
	);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	
	// field remover
	if (Object.prototype.hasOwnProperty.call(options, 'fields'))
		response = utils.fieldsRemover(response, options);
	if (!isRaw) response = [{ status: 'success' }];

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

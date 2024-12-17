import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './DatastoreFolder.resource'
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';

const properties: INodeProperties[] = [
	{
		displayName: 'Folder Name',
		name: 'folderName',
		type: 'string',
		default: '',
		required: true,
		description: 'New Folder Name',
	},
	{
		displayName: 'Parent Folder Name or ID',
		name: 'destFolderId',
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
		options: [
			...types.returnRaw,
		],
	},
];

const displayOptions = {
	show: {
		resource: ['datastoreFolder'],
		operation: ['addFolder'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[]
	let body: IDataObject = {}

	body.parent_node = this.getNodeParameter('destFolderId', i, 0) as string;
	body.folder_name = this.getNodeParameter('folderName', i, 0) as string;

	response = await apiRequest.call(
		this,
		'POST',
		`${endpoint}/folder/add`,
		body,
		query,
	);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = options.isRaw as boolean || false
	let responseModified = response as any

	// field remover
	if (options.hasOwnProperty('fields'))
		responseModified.data = utils.fieldsRemover(responseModified.data, options)
	if (!isRaw)
		responseModified = responseModified.data

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseModified as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

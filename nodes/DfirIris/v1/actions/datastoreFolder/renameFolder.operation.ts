import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './DatastoreFolder.resource'
import { apiRequest } from '../../transport';


const properties: INodeProperties[] = [
	{
		displayName: 'Folder Id',
		name: 'folderId',
		type: 'number',
		default: '',
		required: true,
		description: 'File Id',
	},
	{
		displayName: 'New Folder Name',
		name: 'folderName',
		type: 'string',
		default: '',
		required: true,
		description: 'New Folder Name',
	},
];

const displayOptions = {
	show: {
		resource: ['datastoreFolder'],
		operation: ['renameFolder'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[]
	let body: IDataObject = {}

	body.parent_node = this.getNodeParameter('folderId', i) as string
	body.folder_name = this.getNodeParameter('folderName', i, 0) as string;

	response = await apiRequest.call(
		this,
		'POST',
		`${endpoint}/folder/rename/` + (this.getNodeParameter('folderId', i) as string),
		body,
		query,
	);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './DatastoreFolder.resource';
import { apiRequest } from '../../transport';

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
		displayName: 'New Folder Name',
		name: 'folderName',
		type: 'string',
		default: '',
		required: true,
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
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	const body: IDataObject = {};

	body.parent_node = this.getNodeParameter('folderId', i) as string;
	body.folder_name = this.getNodeParameter('folderName', i, 0) as string;

	const response = await apiRequest.call(
		this,
		'POST',
		`${endpoint}/folder/rename/` + (this.getNodeParameter('folderId', i) as string),
		body,
		query,
	);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject),
		{ itemData: { item: i } },
	);

	return executionData;
}

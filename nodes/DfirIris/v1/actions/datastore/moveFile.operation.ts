import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Datastore.resource'
import { apiRequest, getFolderName } from '../../transport';
import { utils, types } from '../../helpers';


const properties: INodeProperties[] = [
		// boolean block
	{
		displayName: 'Use Folder Id',
		name: 'useFolderUI',
		type: 'boolean',
		default: false,
		// required: true,
		description: 'Use Folder Id',
	},

	{
		displayName: 'Move to Folder Id',
		name: 'folderId',
		type: 'number',
		default: '',
		displayOptions: {
			show: {
				useFolderUI: [true],
			},
		},
		description: 'Folder Id as number',
	},

	{
		displayName: 'Move to Default Folder',
		name: 'folderLabel',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				value: "root",
				name: "Root of the case"
			},
			{
				value: "evidences",
				name: "Evidences"
			},
			{
				value: "iocs",
				name: "IOCs"
			},
			{
				value: "images",
				name: "Images"
			},
		],
		default: 'evidences',
		displayOptions: {
			show: {
				useFolderUI: [false],
			},
		},
		description: 'Use Predefined Folder',
	},
	// end of block
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
		resource: ['datastore'],
		operation: ['moveFile'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[]
	let body: IDataObject = {}

	let folderId: string = this.getNodeParameter('folderId', i, 0) as string;
	const folderLabel: string = this.getNodeParameter('folderLabel', i, '') as string;
	if (folderLabel) folderId = (await getFolderName.call(this, query, folderLabel)) as any;

	body['destination-node'] = folderId

	response = await apiRequest.call(
		this,
		'POST',
		`${endpoint}/file/move/` + (this.getNodeParameter('fileId', i) as string),
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

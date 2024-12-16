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

const fields = [
	"case",
	"path_case_id",
	"path_id",
	"path_is_root",
	"path_name",
	"path_parent_id",
	"path_uuid",
	"registry"
]

const properties: INodeProperties[] = [
	{
		displayName: 'Folder Id',
		name: 'folderId',
		type: 'number',
		default: '',
		required: true,
		description: 'File Id',
	},
	// boolean block
	{
		displayName: 'Use Folder ID',
		name: 'useFolderUI',
		type: 'boolean',
		default: false,
	},

	{
		displayName: 'Folder ID',
		name: 'destFolderId',
		type: 'number',
		default: '',
		description: 'Folder ID as number',
		displayOptions: {
			show: {
				useFolderUI: [true],
			},
		},
	},

	{
		displayName: 'Default Folder',
		name: 'destFolderLabel',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				value: 'root',
				name: 'Root of the Case',
			},
			{
				value: 'evidences',
				name: 'Evidences',
			},
			{
				value: 'iocs',
				name: 'IOCs',
			},
			{
				value: 'images',
				name: 'Images',
			},
		],
		default: 'evidences',
		description: 'Use Predefined Folder',
		displayOptions: {
			show: {
				useFolderUI: [false],
			},
		},
	},
	// end of block

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw, ...types.fieldProperties(fields)],
	},
];

const displayOptions = {
	show: {
		resource: ['datastore'],
		operation: ['moveFolder'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[]
	let body: IDataObject = {}

	let folderId: string = this.getNodeParameter('destFolderId', i, 0) as string;
	const folderLabel: string = this.getNodeParameter('destFolderLabel', i, '') as string;
	if (folderLabel) folderId = (await getFolderName.call(this, query, folderLabel)) as any;

	body['destination-node'] = folderId

	response = await apiRequest.call(
		this,
		'POST',
		`${endpoint}/folder/move/` + (this.getNodeParameter('folderId', i) as string),
		body,
		query,
	);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = options.isRaw as boolean || false

	// field remover
	if (options.hasOwnProperty('fields'))
		response = utils.fieldsRemover(response, options)
	if (!isRaw)
		response = (response as any).data

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

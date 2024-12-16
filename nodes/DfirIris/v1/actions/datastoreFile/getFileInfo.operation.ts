import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './DatastoreFile.resource'
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';

const returnFields: string[] = [
	"file_size",
	"file_is_ioc",
	"file_sha256",
	"file_is_evidence",
	"file_uuid",
	"file_case_id",
	"file_date_added",
	"file_parent_id",
	"added_by_user_id",
	"file_original_name",
	"file_tags",
	"modification_history",
	"file_id",
	"file_description",
	"file_password"
].sort();

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
		options: [
			...types.returnRaw,
			...types.fieldProperties(returnFields)
		],
	},
];

const displayOptions = {
	show: {
		resource: ['datastoreFile'],
		operation: ['getFileInfo'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[]

	response = await apiRequest.call(
		this,
		'GET',
		`${endpoint}/file/info/` + (this.getNodeParameter('fileId', i) as string),
		{},
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

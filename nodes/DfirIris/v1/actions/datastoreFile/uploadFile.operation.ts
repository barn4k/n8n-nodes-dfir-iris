import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { NodeOperationError, BINARY_ENCODING, updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './DatastoreFile.resource';
import { apiRequest } from '../../transport';
import { utils, types } from '../../helpers';

const properties: INodeProperties[] = [
	{
		displayName: 'Destination Folder Name or ID',
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
		displayName: 'Binary Property Name',
		name: 'binaryName',
		type: 'string',
		default: 'data',
		required: true,
		description: 'Name of the binary property which contains the data for the file to be uploaded',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'File Description',
				name: 'file_description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'File Is Evidence',
				name: 'file_is_evidence',
				type: 'boolean',
				default: true,
				description: 'Whether file is Evidence',
			},
			{
				displayName: 'File Is IOC',
				name: 'file_is_ioc',
				type: 'boolean',
				default: false,
				description: 'Whether file is IOC',
			},
			{
				displayName: 'File Password',
				name: 'file_password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
			},
			{
				displayName: 'File Tags',
				name: 'file_tags',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw, ...types.fieldProperties(types.datastoreFileFields)],
	},
];

const displayOptions = {
	show: {
		resource: ['datastoreFile'],
		operation: ['uploadFile'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	const body: IDataObject = {};
	let response;
	// const nodeVersion = this.getNode().typeVersion;
	// const instanceId = this.getInstanceId();

	let uploadData: Buffer | unknown;

	const binaryName = (this.getNodeParameter('binaryName', i, '') as string).trim();
	const binaryData = this.helpers.assertBinaryData(i, binaryName);
	utils.addAdditionalFields.call(this, body, i);

	if (binaryData.id) {
		uploadData = await this.helpers.getBinaryStream(binaryData.id);
	} else {
		uploadData = Buffer.from(binaryData.data, BINARY_ENCODING);
	}

	const fileName = binaryData.fileName as string;
	if (!fileName)
		throw new NodeOperationError(this.getNode(), 'No file name given for file upload.');

	if (Object.prototype.hasOwnProperty.call(body, 'file_is_ioc')) body.file_is_ioc = body.file_is_ioc ? 'y' : 'n';
	if (Object.prototype.hasOwnProperty.call(body, 'file_is_evidence'))
		body.file_is_evidence = body.file_is_evidence ? 'y' : 'n';
	if (!Object.prototype.hasOwnProperty.call(body, 'file_description')) body.file_description = '';
	if (!Object.prototype.hasOwnProperty.call(body, 'file_tags')) body.file_tags = '';

	const formData = {
		file_content: {
			value: uploadData,
			options: {
				filename: fileName,
				contentType: binaryData.mimeType,
			},
		},
		file_original_name: fileName,
		...body,
	};

	response = await apiRequest.call(
		this,
		'POST',
		(`${endpoint}/file/add/` + this.getNodeParameter('folderId', i, 0)) as string,
		formData,
		query,
		{},
		true,
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

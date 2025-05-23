import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { NodeOperationError, BINARY_ENCODING, updateDisplayOptions } from 'n8n-workflow';

import FormData from 'form-data';

import type { Readable } from 'stream';

import { endpoint } from './DatastoreFile.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';
import * as local from './commonDescription';

const properties: INodeProperties[] = [
	local.rFileId,
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Set File as Evidence',
				name: 'file_is_evidence',
				type: 'boolean',
				default: true,
				description: 'Whether file is Evidence',
			},
			{
				displayName: 'Set File as IOC',
				name: 'file_is_ioc',
				type: 'boolean',
				default: false,
				description: 'Whether file is IOC',
			},
			{
				displayName: 'Set New Description',
				name: 'file_description',
				type: 'string',
				default: '',
				description: 'File Description',
			},
			{
				displayName: 'Set New File Content',
				name: 'binaryName',
				type: 'string',
				default: 'data',
				description:
					'Name of the binary property which contains the data for the file to be uploaded',
			},
			{
				displayName: 'Set New File Name',
				name: 'file_original_name',
				type: 'string',
				default: '',
				description: 'Set the file name',
			},
			{
				displayName: 'Set New Password',
				name: 'file_password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'File Password',
			},
			{
				displayName: 'Set New Tags',
				name: 'file_tags',
				type: 'string',
				default: '',
				description: 'File Password',
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
		operation: ['updateFileInfo'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let body: IDataObject | FormData = {};
	let response: INodeExecutionData[];
	// const nodeVersion = this.getNode().typeVersion;
	// const instanceId = this.getInstanceId();

	let uploadData: Buffer | Readable;
	utils.addAdditionalFields.call(this, body, i);

	if (body.hasOwnProperty('binaryName')) {
		const binaryName = (body.binaryName as string).trim();
		const binaryData = this.helpers.assertBinaryData(i, binaryName);

		if (binaryData.id) {
			uploadData = await this.helpers.getBinaryStream(binaryData.id);
		} else {
			uploadData = Buffer.from(binaryData.data, BINARY_ENCODING);
		}

		const fileName = (body.file_original_name || binaryData.fileName) as string;
		if (!fileName)
			throw new NodeOperationError(this.getNode(), 'No file name given for file upload.');

		body.file_content = {
			value: uploadData,
			options: {
				filename: fileName,
				contentType: binaryData.mimeType,
			},
		};
	}

	response = await apiRequest.call(
		this,
		'POST',
		`${endpoint}/file/update/` + this.getNodeParameter('file_id', i, 0),
		body,
		query,
		{},
		true,
	);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	let responseModified = response as any;

	// field remover
	if (options.hasOwnProperty('fields'))
		responseModified.data = utils.fieldsRemover(responseModified.data, options);
	if (!isRaw) responseModified = responseModified.data;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseModified as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

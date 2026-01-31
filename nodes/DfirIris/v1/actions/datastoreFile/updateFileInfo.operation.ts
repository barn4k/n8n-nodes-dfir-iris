import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { NodeOperationError, updateDisplayOptions } from 'n8n-workflow';

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
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	const body: IDataObject = {};
	let response;
	const irisLogger = new utils.IrisLog(this.logger);
	// const nodeVersion = this.getNode().typeVersion;
	// const instanceId = this.getInstanceId();

	utils.addAdditionalFields.call(this, body, i);

	const form = new FormData();
	if (Object.prototype.hasOwnProperty.call(body, 'binaryName')) {
		const binaryProperty = (this.getNodeParameter('binaryName', i, 'data') as string).trim();
		const binaryData = this.helpers.assertBinaryData(i, binaryProperty);
		const binaryDataBuffer  = await this.helpers.getBinaryDataBuffer(i, binaryProperty);

		const fileName = binaryData.fileName as string;
		if (!fileName)
			throw new NodeOperationError(this.getNode(), 'No file name given for file upload.');

		irisLogger.info('Uploading file', { fileName, mimeType: binaryData.mimeType });
		irisLogger.info('binaryDataBuffer', { buffer: binaryDataBuffer });
		form.append(
			'file_content',
			new Blob([binaryDataBuffer], { type: binaryData.mimeType }),
			fileName
		);

		form.append('file_original_name', fileName);
	}

	const file_is_ioc = body.file_is_ioc ? 'y' : 'n';
	const file_is_evidence = body.file_is_evidence ? 'y' : 'n';
	const file_description = body.file_description || '';
	const file_tags = body.file_tags || '';

	if (Object.prototype.hasOwnProperty.call(body, 'file_is_ioc')) 
		form.append('file_is_ioc', file_is_ioc);
	if (Object.prototype.hasOwnProperty.call(body, 'file_is_evidence')) 
		form.append('file_is_evidence', file_is_evidence);
	if (Object.prototype.hasOwnProperty.call(body, 'file_description')) 
		form.append('file_description', file_description);
	if (Object.prototype.hasOwnProperty.call(body, 'file_tags')) 
		form.append('file_tags', file_tags);


	response = await apiRequest.call(
		this,
		'POST',
		`${endpoint}/file/update/` + this.getNodeParameter('file_id', i, 0),
		form,
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

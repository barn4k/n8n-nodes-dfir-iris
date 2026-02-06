import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Evidence.resource';
import { apiRequest } from '../../transport';
import { utils, types } from '../../helpers';
import * as local from './commonDescription';
import { createHash } from 'crypto';

const properties: INodeProperties[] = [
	{ ...local.fileId, required: true },
	{
			displayName: 'Get Data From Binary File',
			name: 'parseBinary',
			type: 'boolean',
			default: false,
			description: 'Whether to read the file data from a binary property. If enabled, Will automatically fill filesize, filename and calculate sha256.',
		},
		{
			displayName: 'Binary Property Name',
			name: 'binaryName',
			type: 'string',
			default: 'data',
			displayOptions: {
				show: {
					parseBinary: [true],
				},
			},
			description: 'Name of the binary property for parsing data',
		},
		{
			displayName: 'Sha256 Hash',
			name: 'isSha256',
			type: 'boolean',
			default: true,
			displayOptions: {
				show: {
					parseBinary: [true],
				},
			},
			description: 'Whether to calculate the sha256 hash of the binary data or sha1',
		},
		local.fileName,
		local.fileSize,
		local.fileHash,
		{
			displayName: 'Additional Fields',
			name: 'additionalFields',
			type: 'collection',
			placeholder: 'Add Field',
			default: {},
			options: [
				local.fileDescription,
				local.fileType,
				types.customAttributes,
			],
		},
		{
			displayName: 'Options',
			name: 'options',
			type: 'collection',
			placeholder: 'Add Option',
			default: {},
			options: [...types.returnRaw, ...types.fieldProperties(types.evidenceFields)],
		},
];

const displayOptions = {
	show: {
		resource: ['evidence'],
		operation: ['updateEvidence'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
		let response;
		const body: IDataObject = {};
		// const irisLogger = new utils.IrisLog(this.logger);
	
		const isBinary = this.getNodeParameter('parseBinary', i) as boolean;
		if (isBinary) {
			const binaryPropertyName = this.getNodeParameter('binaryName', i) as string;
			const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
			const binaryDataBuffer  = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
			const hashType = (this.getNodeParameter('isSha256', i) as boolean) ? 'sha256' : 'sha1';
	
			body.file_size = binaryDataBuffer.byteLength;
			body.filename = binaryData.fileName;
			body.file_hash = createHash(hashType)
				.setEncoding('hex')
				.update(binaryDataBuffer)
				.digest('hex');
			// irisLogger.info(`Parsed binary data`,{body});
		} else {
			const filename = this.getNodeParameter(local.fileName.name, i) as string;
			const fileSize = this.getNodeParameter(local.fileSize.name, i) as number;
			const fileHash = this.getNodeParameter(local.fileHash.name, i) as string;
	
			if (filename) body.filename = filename;
			if (fileSize) body.file_size = fileSize;
			if (fileHash) body.file_hash = fileHash;
		}
		utils.addAdditionalFields.call(this, body, i);
		if (body.type_id === undefined || body.type_id === null) body.type_id = 1; // default to generic file type
	
		response = await apiRequest.call(
			this,
			'POST',
			`${endpoint}/update/${this.getNodeParameter(local.fileId.name, i)}`,
			body,
			query,
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

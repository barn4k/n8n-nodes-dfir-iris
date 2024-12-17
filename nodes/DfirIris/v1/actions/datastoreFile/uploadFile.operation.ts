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
import { utils } from '../../helpers';
import { types } from '../../helpers';

const returnFields: string[] = [
	'file_size',
	'file_is_ioc',
	'file_sha256',
	'file_is_evidence',
	'file_uuid',
	'file_case_id',
	'file_date_added',
	'file_parent_id',
	'added_by_user_id',
	'file_original_name',
	'file_tags',
	'modification_history',
	'file_id',
	'file_description',
	'file_password',
].sort();

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
				displayName: 'File Tags',
				name: 'file_tags',
				type: 'string',
				default: '',
			},
			{
				displayName: 'File Password',
				name: 'file_password',
				type: 'string',
				typeOptions: { password: true },
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
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw, ...types.fieldProperties(returnFields)],
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
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let body: IDataObject | FormData = {};
	let response: INodeExecutionData[]
	// const nodeVersion = this.getNode().typeVersion;
	// const instanceId = this.getInstanceId();

	let uploadData: Buffer | Readable;

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

	// TODO: fix later formdata
	// const formData = new FormData();

	if (body.hasOwnProperty('file_is_ioc'))
		body.file_is_ioc = body.file_is_ioc ? 'y' : 'n';
	if (body.hasOwnProperty('file_is_evidence'))
		body.file_is_evidence = body.file_is_evidence ? 'y' : 'n';
	if (!body.hasOwnProperty('file_description'))
		body.file_description = '';
	if (!body.hasOwnProperty('file_tags'))
		body.file_tags = '';

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

	// formData.append('file_original_name', fileName)
	// console.debug('appended file_original_name')
	// console.debug('--- fileName: ', fileName)

	// // formData.append('file_content', uploadData, fileName);
	// console.debug('appended file_content')
	// console.debug('--- uploadData: ', uploadData)
	// console.debug('--- options: ', {filename: fileName,contentType: binaryData.mimeType})
	// formData.append('file_content', (uploadData as Buffer), fileName);

	// formData.append('file_content', uploadData, {
	// 	filename: fileName,
	// 	contentType: binaryData.mimeType
	// });

	// const keysToAdd = [
	// 	'file_description',
	// 	'file_password',
	// 	'file_tags',
	// 	'file_is_evidence',
	// 	'file_is_ioc',
	// ]
	// keysToAdd.forEach( (k: string) => {
	// 	let _v
	// 	if (body.hasOwnProperty(k)){
	// 		_v = (body as IDataObject)[k]
	// 		if (typeof _v === 'boolean')
	// 			_v = _v ? 'Y' : 'N'
	// 		this.logger.debug(`appending property ${k}: `+_v)
	// 		formData.append(k, _v);
	// 	}
	// })

	response = await apiRequest.call(
		this,
		'POST',
		`${endpoint}/file/add/` + this.getNodeParameter('folderId', i, 0) as string,
		formData,
		query,
		{},
		true,
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

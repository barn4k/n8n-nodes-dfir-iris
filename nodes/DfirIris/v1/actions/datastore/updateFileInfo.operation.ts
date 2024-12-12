// import type {
// 	IDataObject,
// 	IExecuteFunctions,
// 	INodeExecutionData,
// 	INodeProperties,
// } from 'n8n-workflow';

// import {
// 	NodeOperationError,
// 	BINARY_ENCODING,
// 	updateDisplayOptions
// } from 'n8n-workflow';

// import FormData from 'form-data'

// import type { Readable } from 'stream';

// import { endpoint } from './Datastore.resource'
// import { apiRequest } from '../../transport';
// import { types, utils } from '../../helpers';

// const returnFields: string[] = [
// 	"file_size",
// 	"file_is_ioc",
// 	"file_sha256",
// 	"file_is_evidence",
// 	"file_uuid",
// 	"file_case_id",
// 	"file_date_added",
// 	"file_parent_id",
// 	"added_by_user_id",
// 	"file_original_name",
// 	"file_tags",
// 	"modification_history",
// 	"file_id",
// 	"file_description",
// 	"file_password"
// ]

// const properties: INodeProperties[] = [
// 	{
// 		displayName: 'File Id',
// 		name: 'fileId',
// 		type: 'number',
// 		default: '',
// 		required: true,
// 		description: 'File Id',
// 	},
// 	{
// 		displayName: 'Additional Fields',
// 		name: 'additionalFields',
// 		type: 'collection',
// 		placeholder: 'Add Field',
// 		default: {},
// 		options: [
// 			{
// 				displayName: 'Set new File Name',
// 				name: 'file_original_name',
// 				type: 'string',
// 				default: '',
// 				description: 'Set the file name',
// 			},
// 			{
// 				displayName: 'Set new File Content',
// 				name: 'binaryName',
// 				type: 'string',
// 				default: 'data',
// 				description: 'Name of the binary property which contains the data for the file to be uploaded',
// 			},
// 			{
// 				displayName: 'Set new Description',
// 				name: 'file_description',
// 				type: 'string',
// 				default: '',
// 				description: 'File Description',
// 			},
// 			{
// 				displayName: 'Set new Password',
// 				name: 'file_password',
// 				type: 'string',
// 				default: '',
// 				description: 'File Password',
// 			},
// 			{
// 				displayName: 'Set new Tags',
// 				name: 'file_tags',
// 				type: 'string',
// 				default: '',
// 				description: 'File Password',
// 			},
// 			{
// 				displayName: 'Set File as Evidence',
// 				name: 'file_is_evidence',
// 				type: 'boolean',
// 				default: true,
// 				description: 'Whether file is Evidence',
// 			},
// 			{
// 				displayName: 'Set File as IOC',
// 				name: 'file_is_ioc',
// 				type: 'boolean',
// 				default: false,
// 				description: 'Whether file is IOC',
// 			},
// 		],
// 	},
// 	{
// 		displayName: 'Options',
// 		name: 'options',
// 		type: 'collection',
// 		placeholder: 'Add Option',
// 		default: {},
// 		options: [
// 			...types.returnRaw,
// 			...types.fieldProperties(returnFields),
// 		],
// 	},
// ];

// const displayOptions = {
// 	show: {
// 		resource: ['datastore'],
// 		operation: ['updateFileInfo'],
// 	},
// };

// export const description = updateDisplayOptions(displayOptions, properties);

// export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
// 	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
// 	let body: IDataObject | FormData = {}
// 	let response: INodeExecutionData[]
// 	// const nodeVersion = this.getNode().typeVersion;
// 	// const instanceId = this.getInstanceId();

// 	// let folderId: string = this.getNodeParameter('folderId', i, 0) as string;
// 	// const folderLabel: string = this.getNodeParameter('folderLabel', i, '') as string;
// 	// let uploadData: Buffer | Readable;

// 	// if (folderLabel)
// 	// 	folderId = await getFolderName.call(this, query, folderLabel) as any

// 	// const binaryName = (this.getNodeParameter('binaryName', i, '') as string).trim();
// 	// const binaryData = this.helpers.assertBinaryData(i, binaryName);
// 	// utils.addAdditionalFields.call(this, body, i)

// 	// if (binaryData.id) {
// 	// 	uploadData = await this.helpers.getBinaryStream(binaryData.id);
// 	// } else {
// 	// 	uploadData = Buffer.from(binaryData.data, BINARY_ENCODING);
// 	// }

// 	// const fileName = binaryData.fileName as string;
// 	// if (!fileName)
// 	// 	throw new NodeOperationError(this.getNode(), 'No file name given for file upload.');

// 	// if (body.hasOwnProperty('file_is_ioc'))
// 	// 	body.file_is_ioc = body.file_is_ioc ? 'y' : 'n'
// 	// if (body.hasOwnProperty('file_is_evidence'))
// 	// 	body.file_is_evidence = body.file_is_evidence ? 'y' : 'n'

// 	// const formData = {
// 	// 	file_content: {
// 	// 		value: uploadData,
// 	// 		options: {
// 	// 			filename: fileName,
// 	// 			contentType: binaryData.mimeType
// 	// 		}
// 	// 	},
// 	// 	file_original_name: fileName,
// 	// 	...body
// 	// }

// 	let uploadData: Buffer | Readable;
// 	const formData = new FormData();
// 	utils.addAdditionalFields.call(this, body, i)

// 	if (body.hasOwnProperty('binaryName')){
// 		const binaryName = (body.binaryName as string).trim();
// 		const binaryData = this.helpers.assertBinaryData(i, binaryName);

// 		if (binaryData.id) {
// 			uploadData = await this.helpers.getBinaryStream(binaryData.id);
// 		} else {
// 			uploadData = Buffer.from(binaryData.data, BINARY_ENCODING);
// 		}

// 		const fileName = (body.file_original_name || binaryData.fileName) as string;
// 		if (!fileName)
// 			throw new NodeOperationError(this.getNode(), 'No file name given for file upload.');

// 		formData.append('file_original_name', fileName)
// 		formData.append('file_content', uploadData, {
// 		filename: fileName,
// 		contentType: binaryData.mimeType
// 	});
// 	}

// 	const keysToAdd = [
// 		'file_description',
// 		'file_password',
// 		'file_tags',
// 		'file_is_evidence',
// 		'file_is_ioc',
// 	]
// 	keysToAdd.forEach( (k: string) => {
// 		let _v
// 		if (body.hasOwnProperty(k)){
// 			_v = (body as IDataObject)[k]
// 			if (typeof _v === 'boolean')
// 				_v = _v ? 'Y' : 'N'
// 			this.logger.debug(`appending property ${k}: `+_v)
// 			formData.append(k, _v);
// 		}
// 	})

// 	body = formData

// 	response = await apiRequest.call(
// 		this,
// 		'POST',
// 		`${endpoint}/file/update/` + this.getNodeParameter('fileId', i, 0),
// 		body,
// 		query,
// 		{},
// 		true
// 	);

// 	const executionData = this.helpers.constructExecutionMetaData(
// 		this.helpers.returnJsonArray(response as IDataObject[]),
// 		{ itemData: { item: i } },
// 	);

// 	return executionData;
// }

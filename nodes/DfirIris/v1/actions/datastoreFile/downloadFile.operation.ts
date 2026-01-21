import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IBinaryKeyData,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './DatastoreFile.resource';
import { apiRequest } from '../../transport';
import { utils } from '../../helpers';
import * as local from './commonDescription';

const properties: INodeProperties[] = [
	local.rFileId,
	{
		displayName: 'Put Output File in Field',
		name: 'binaryName',
		type: 'string',
		default: 'data',
		required: true,
		description: 'The name of the output binary field to put the file in',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Set New File Name',
				name: 'fileName',
				type: 'string',
				default: '',
				description: 'Set the new file name',
			},
		],
	},
];

const displayOptions = {
	show: {
		resource: ['datastoreFile'],
		operation: ['downloadFile'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	const body: IDataObject = {};
	// const nodeVersion = this.getNode().typeVersion;
	// const instanceId = this.getInstanceId();

	utils.addAdditionalFields.call(this, body, i);

	const response = await apiRequest.call(
		this,
		'GET',
		`${endpoint}/file/view/` + (this.getNodeParameter('file_id', i) as string),
		{},
		query,
		{
			// useStream: true,
			returnFullResponse: true,
			encoding: 'arraybuffer',
			json: false,
		},
	);

	const binaryName = (this.getNodeParameter('binaryName', i, '') as string).trim();
	const headers = response.headers as IDataObject
	const mimeType = headers?.['content-type'] ?? undefined;
	const contentDisposition = (headers['content-disposition'] ?? undefined) as string
	const fileName =
		(body as IDataObject).fileName ??
		(response.contentDisposition as IDataObject)?.filename ??
		contentDisposition
			.split('; ')
			.filter((d: string) => d.indexOf('filename') >= 0)[0]
			.replace('filename=', '');

	let item = this.getInputData()[i];
	const newItem: INodeExecutionData = {
		json: item.json,
		binary: {},
	};

	if (item.binary !== undefined) {
		// Create a shallow copy of the binary data so that the old
		// data references which do not get changed still stay behind
		// but the incoming data does not get changed.
		Object.assign(newItem.binary as IBinaryKeyData, item.binary);
	}

	item = newItem;

	item.binary![binaryName] = await this.helpers.prepareBinaryData(
		Buffer.from(response.body as ArrayBuffer),
		fileName as string,
		mimeType as string,
	);

	const executionData = this.helpers.constructExecutionMetaData([item], { itemData: { item: i } });

	return executionData;
}

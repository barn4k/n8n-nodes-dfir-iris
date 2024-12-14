import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IBinaryKeyData,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Datastore.resource';
import { apiRequest } from '../../transport';
import { utils } from '../../helpers';

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
				displayName: 'Set new File Name',
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
		resource: ['datastore'],
		operation: ['downloadFile'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let body: IDataObject | FormData = {};
	let response: any;
	// const nodeVersion = this.getNode().typeVersion;
	// const instanceId = this.getInstanceId();

	utils.addAdditionalFields.call(this, body, i);

	response = await apiRequest.call(
		this,
		'GET',
		`${endpoint}/file/view/` + (this.getNodeParameter('fileId', i) as string),
		{},
		query,
		{
			useStream: true,
			returnFullResponse: true,
			encoding: 'arraybuffer',
			json: false,
		},
	);

	const binaryName = (this.getNodeParameter('binaryName', i, '') as string).trim();
	const mimeType = (response.headers as IDataObject)?.['content-type'] ?? undefined
	const fileName = (body as any).fileName ?? response.contentDisposition?.filename ?? response.headers?.['content-disposition'].split('; ').filter(
		(d: string) => d.indexOf('filename')>=0)[0].replace('filename=', '')

	let item = this.getInputData()[i]
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
		response as Buffer,
		fileName as string,
		mimeType as string,
	);

	const executionData = this.helpers.constructExecutionMetaData([item], { itemData: { item: i } });

	return executionData;
}

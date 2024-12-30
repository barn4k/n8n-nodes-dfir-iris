import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions, NodeOperationError } from 'n8n-workflow';

import { endpoint } from './Alert.resource';
import { apiRequest } from '../../transport';
import { types } from '../../helpers';

const properties: INodeProperties[] = [
	{
		displayName: 'Alert IDs',
		name: 'ids',
		type: 'string',
		description: 'Comma-separated list of alert IDs',
		placeholder: '1,2,3',
		default: '',
		required: true,
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw],
	},
];

const displayOptions = {
	show: {
		resource: ['alert'],
		operation: ['batchDelete'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];

	let body: IDataObject = {};
	try {
		body.alert_ids = (this.getNodeParameter('ids', i) as string)
			.replace(/\s/g, '')
			.split(',')
			.map((x) => parseInt(x));
	} catch {
		throw new NodeOperationError(
			this.getNode(),
			'List of IDs is not valid. It should be a comma-separated list of Alert IDs',
			{ itemIndex: i },
		);
	}

	response = await apiRequest.call(this, 'POST', `${endpoint}/batch/delete`, body, query);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	let responseModified = response as any;

	if (!isRaw) responseModified = { status: 'success' };

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseModified as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { apiRequest } from '../../transport';
import { types } from '../../helpers';
import * as local from './commonDescription';

const properties: INodeProperties[] = [
	local.rObjectName,
	local.rObjectId,
	local.rCommentId,

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
		resource: ['comment'],
		operation: ['deleteComment'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];

	const obj_name = this.getNodeParameter('obj_name', i) as string;
	const obj_id = this.getNodeParameter('obj_id', i) as string;
	const comment_id = this.getNodeParameter('comment_id', i) as string;

	response = await apiRequest.call(
		this,
		'POST',
		`case/${obj_name}/${obj_id}/comments/${comment_id}/delete`,
		{},
		query,
	);

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

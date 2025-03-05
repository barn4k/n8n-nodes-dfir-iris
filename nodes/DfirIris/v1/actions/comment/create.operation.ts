import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';
import * as local from './commonDescription';

const fields = [
	'comment_date',
	'comment_id',
	'comment_text',
	'comment_update_date',
	'comment_uuid',
	'name',
	'user',
];

const properties: INodeProperties[] = [
	local.rObjectName,
	local.rObjectId,
	local.rCommentText,

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw, ...types.fieldProperties(fields)],
	},
];

const displayOptions = {
	show: {
		resource: ['comment'],
		operation: ['create'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	body.comment_text = this.getNodeParameter('comment_text', i) as string;

	const obj_name = this.getNodeParameter('obj_name', i) as string;
	const obj_id = this.getNodeParameter('obj_id', i) as string;
	const uri_base = obj_name === 'alert' ? 'alerts' : `case/${obj_name}`

	response = await apiRequest.call(
		this,
		'POST',
		`${uri_base}/${obj_id}/comments/add`,
		body,
		query,
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

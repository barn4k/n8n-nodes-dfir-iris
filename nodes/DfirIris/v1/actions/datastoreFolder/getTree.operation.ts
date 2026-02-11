import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './DatastoreFolder.resource';
import { apiRequest } from '../../transport';
import { types } from '../../helpers';
import { getFlattenTree } from '../../helpers/utils';

const properties: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			...types.returnRaw,
			{
				displayName: 'Simplify',
				name: '__simplify',
				type: 'boolean',
				default: false,
				description: "Whether to return a flat list of objects instead of a tree"
			},
			{
				displayName: 'Simplify Type',
				name: '__simplify_type',
				type: 'options',
				options: [
					{name: 'Return only Files', value: 'file'},
					{name: 'Return only Folders', value: 'folder'},
					{name: 'Return All', value: 'all'},
				],
				default: 'all',
				description: "Which entities to return in simplified mode",
				displayOptions: {
					show: {
						__simplify: [true]
					}
				}
			},
		],
	},
];

const displayOptions = {
	show: {
		resource: ['datastoreFolder'],
		operation: ['getTree'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response;

	response = await apiRequest.call(this, 'GET', `${endpoint}/list/tree`, {}, query);

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	const returnSimple = (options.__simplify as boolean) || false;
	const returnSimpleType = options.__simplify_type as 'file'|'folder'|'all' || 'all';
	

	if (returnSimple){
		response.data = getFlattenTree((response.data as types.IFolder['data']), "", "", returnSimpleType)
	}

	if (!isRaw) response = response.data;


	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Note.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';

const fields = [
	'custom_attributes',
	'directory',
	'directory_id',
	'modification_history',
	'note_case_id',
	'note_content',
	'note_creationdate',
	'note_id',
	'note_lastupdate',
	'note_title',
	'note_user',
	'note_uuid',
];

const properties: INodeProperties[] = [
	{
		displayName: 'Note Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
	},
	{
		displayName: 'Note Content',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
	},
	{
		displayName: 'Group Name or ID',
		name: 'directory_id',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getNoteGroups',
			loadOptionsDependsOn: ['cid'],
		},
		default: '',
		required: true,
	},

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
		resource: ['note'],
		operation: ['create'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response;
	const body: IDataObject = {};

	body.note_title = this.getNodeParameter('title', i) as string;
	body.note_content = this.getNodeParameter('content', i) as string;
	body.directory_id = this.getNodeParameter('directory_id', i) as number;

	response = await apiRequest.call(this, 'POST', `${endpoint}/add`, body, query);

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

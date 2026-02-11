import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';

const fields = [
	"activity_date",
	"activity_desc",
	"case",
	"case_id",
	"display_in_ui",
	"is_from_api",
	"registry",
	"id",
	"user",
	"user_id",
	"user_input"
].sort();

const properties: INodeProperties[] = [
	{
		displayName: 'Activity Log Content',
		name: 'log_content',
		type: 'string',
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
		resource: ['case'],
		operation: ['addTaskLog'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = {};
	let response;
	const body: IDataObject = {};

	body.log_content = this.getNodeParameter('log_content', i) as string;

	response = await apiRequest.call(this, 'POST', `case/tasklog/add`, body, query);

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

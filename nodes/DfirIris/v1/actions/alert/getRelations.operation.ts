import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Alert.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';
import * as local from './commonDescription';

const properties: INodeProperties[] = [
	local.rAlertId,
	{
		displayName: 'Look Into Closed Alerts',
		name: 'closedAlerts',
		type: 'boolean',
		default: true,
	},
	{
		displayName: 'Look Into Closed Cases',
		name: 'closedCases',
		type: 'boolean',
		default: true,
	},
	{
		displayName: 'Look Into Open Alerts',
		name: 'openAlerts',
		type: 'boolean',
		default: true,
	},
	{
		displayName: 'Look Into Open Cases',
		name: 'openCases',
		type: 'boolean',
		default: true,
	},
	{
		displayName: 'Days Back',
		name: 'daysBack',
		type: 'number',
		default: 60,
	},
	{
		displayName: 'Number Of Nodes',
		name: 'nodesAmount',
		type: 'number',
		default: 100,
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
		operation: ['getRelations'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const options = this.getNodeParameter('options', i, {});
	const query: IDataObject = {
		cid: 1,
		"open-alerts": this.getNodeParameter('openAlerts', i, true) as boolean,
		"closed-alerts": this.getNodeParameter('closedAlerts', i, true) as boolean,
		"open-cases": this.getNodeParameter('openCases', i, true) as boolean,
		"closed-cases": this.getNodeParameter('closedCases', i, true) as boolean,
		"days-back": this.getNodeParameter('daysBack', i, 60) as number,
		"number-of-nodes": this.getNodeParameter('nodesAmount', i, 100) as number,
	};
	let response;

	response = await apiRequest.call(
		this,
		'GET',
		(`${endpoint}/similarities/` + this.getNodeParameter('alert_id', i)) as string,
		{},
		query,
	);


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

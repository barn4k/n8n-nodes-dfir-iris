import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions } from 'n8n-workflow';

import { endpoint } from './Alert.resource';
import { apiRequestAll } from '../../transport';
import { types, utils } from '../../helpers';
import * as local from './commonDescription';

const fields = [
	"alert_classification_id",
	"alert_context",
	"alert_creation_time",
	"alert_customer_id",
	"alert_description",
	"alert_id",
	"alert_note",
	"alert_owner_id",
	"alert_resolution_status_id",
	"alert_severity_id",
	"alert_source",
	"alert_source_content",
	"alert_source_event_time",
	"alert_source_link",
	"alert_source_ref",
	"alert_status_id",
	"alert_tags",
	"alert_title",
	"alert_uuid",
	"assets",
	"cases",
	"classification",
	"comments",
	"customer",
	"iocs",
	"modification_history",
	"owner",
	"resolution_status",
	"severity",
	"status"
]

const properties: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			local.alertAssets,
			local.alertClassification,
			local.alertCustomer,
			{ ...local.alertDescription, description: "You can use part of the string" },
			local.alertEndDate,
			local.alertIds,
			local.alertIocs,
			local.alertOwner,
			// local.alertResolutionStatus, // filter not work
			local.alertSeverity,
			{ ...local.alertSource, description: "You can use part of the string" },
			local.alertStartDate,
			local.alertStatus,
			{ ...local.alertTags, description: "You can use part of the string" },
			{ ...local.alertTitle, description: "You can use part of the string" },
		],
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
		resource: ['alert'],
		operation: ['countAlerts'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: 1, sort: 'desc' };
	const body: IDataObject = {};
	const irisLogger = new utils.IrisLog(this.logger);
	let response

	utils.addAdditionalFields.call(this, body, i);
	irisLogger.info('updated body', {body});

	Object.assign(query, body);

	response = await apiRequestAll.call(this, 'GET', `${endpoint}/filter`, {}, query, 1, 1, 'alerts');

	const options = this.getNodeParameter('options', i, {});
	const isRaw = (options.isRaw as boolean) || false;
	irisLogger.info('response', {response});

	// field remover
	if (
		Object.prototype.hasOwnProperty.call(options, 'fields') 
		&& response.data 
		&& typeof response.data === 'object' 
		&& 'alerts' in response.data
	) {
		const data = response.data as IDataObject;
		data.alerts = utils.fieldsRemover((data.alerts as IDataObject[]), options);
	}

	if (!isRaw) response = [{ total: (response.data as IDataObject).total || 0 }];

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

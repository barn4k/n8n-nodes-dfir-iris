import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodePropertyOptions,
} from 'n8n-workflow';

import type { IIOC, IAsset } from '../../helpers/types';

import { updateDisplayOptions, NodeOperationError } from 'n8n-workflow';

import { endpoint } from './Alert.resource';
import { apiRequest } from '../../transport';
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
	{ ...local.alertCustomer, required: true },
	{ ...local.alertSeverity, required: true },
	{ ...local.alertStatus, required: true },
	{ ...local.alertTitle, required: true },
	// local.rAlertCustomer,
	// local.rAlertSeverity,
	// local.rAlertStatus,
	// local.rAlertTitle,
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			...local.alertAssetProps,
			...local.alertIocProps,
			local.alertClassification,
			...local.alertContextProps,
			local.alertDescription,
			local.alertNote,
			local.alertResolutionStatus,
			...local.alertSourceProps,
			local.alertTags,
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
		operation: ['create'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	const body: IDataObject = {};
	let response;

	body.alert_title = this.getNodeParameter('alert_title', i) as string;
	body.alert_customer_id = this.getNodeParameter('alert_customer_id', i) as number;
	body.alert_severity_id = this.getNodeParameter('alert_severity_id', i) as number;
	body.alert_status_id = this.getNodeParameter('alert_status_id', i) as number;

	utils.addAdditionalFields.call(this, body, i);

	const kvUI = this.getNodeParameter(
		'__alertContextKV.parameters',
		i,
		null,
	) as INodePropertyOptions[];
	const jsUI = this.getNodeParameter('__alertContextJSON', i, null) as string;

	if (kvUI !== null && kvUI.length > 0) {
		body.alert_context = Object.fromEntries(
			kvUI.map((p: INodePropertyOptions) => [p.name, p.value]),
		);
	} else if (jsUI !== null) {
		try {
			body.alert_context = JSON.parse(jsUI);
		} catch {
			throw new NodeOperationError(this.getNode(), 'JSON parameter need to be an valid JSON', {
				itemIndex: i,
			});
		}
	}

	let iocs = this.getNodeParameter(
		'additionalFields.__iocsCollection.iocData',
		i,
		null,
	) as Array<IIOC>;
	let assets = this.getNodeParameter(
		'additionalFields.__assetsCollection.assetData',
		i,
		null,
	) as Array<IAsset>;

	const iocsJSON = this.getNodeParameter(
		'additionalFields.__iocsCollectionJSON',
		i,
		null,
	) as Array<IIOC>;
	const assetsJSON = this.getNodeParameter(
		'additionalFields.__assetsCollectionJSON',
		i,
		null,
	) as Array<IAsset>;

	if (iocsJSON !== null) iocs = iocsJSON;

	if (assetsJSON !== null) assets = assetsJSON;

	if (iocs !== null) body.alert_iocs = iocs;

	if (assets !== null) body.alert_assets = assets;

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

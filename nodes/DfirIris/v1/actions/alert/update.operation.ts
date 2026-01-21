import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodePropertyOptions,
} from 'n8n-workflow';

import { updateDisplayOptions, NodeOperationError } from 'n8n-workflow';

import type { IIOC, IAsset, IAlert } from '../../helpers/types';

import { endpoint } from './Alert.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';
import * as local from './commonDescription';

const fields = [
	'alert_classification_id',
	'alert_context',
	'alert_creation_time',
	'alert_customer_id',
	'alert_description',
	'alert_id',
	'alert_note',
	'alert_owner_id',
	'alert_resolution_status_id',
	'alert_severity_id',
	'alert_source',
	'alert_source_content',
	'alert_source_event_time',
	'alert_source_link',
	'alert_source_ref',
	'alert_status_id',
	'alert_tags',
	'alert_title',
	'alert_uuid',
	'assets',
	'cases',
	'classification',
	'comments',
	'customer',
	'iocs',
	'modification_history',
	'owner',
	'resolution_status',
	'severity',
	'status',
];

const properties: INodeProperties[] = [
	local.rAlertId,
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			...local.alertAssetProps,
			...local.alertIocProps, // No property in API schema
			local.alertClassification,
			...local.alertContextProps,
			local.alertCustomer,
			local.alertDescription,
			local.alertResolutionStatus,
			local.alertNote,
			local.alertSeverity,
			...local.alertSourceProps,
			local.alertStatus,
			local.alertTags,
			local.alertTitle,
		],
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Replace IOCs and Assets',
				name: 'sendEmptyFields',
				type: 'boolean',
				default: false,
				description:
					'Whether to replace IOC/Asset from the alert. If the "IOC value/Asset name" is empty, then removes it from the alert. Otherwise will ignore empty fields.',
			},
			...types.returnRaw,
			...types.fieldProperties(fields),
		],
	},
];

const displayOptions = {
	show: {
		resource: ['alert'],
		operation: ['update'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response;
	const body: IDataObject = {};
	const alertId = this.getNodeParameter('alert_id', i) as string;

	utils.addAdditionalFields.call(this, body, i);
	const kvUI = this.getNodeParameter(
		'__alertContextKV.parameters',
		i,
		null,
	) as INodePropertyOptions[];
	const jsUI = this.getNodeParameter('__alertContextJSON', i, null) as string;

	const sendEmpty = this.getNodeParameter('options.sendEmptyFields', i, false) as boolean;

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

	const options = this.getNodeParameter('options', i, {});

	let iocs = this.getNodeParameter(
		'additionalFields.__iocsCollection.iocData', i, null) as Array<IIOC>;
	let assets = this.getNodeParameter(
		'additionalFields.__assetsCollection.assetData', i, null) as Array<IAsset>;

	const iocsJSON = this.getNodeParameter(
		'additionalFields.__iocsCollectionJSON', i, null) as Array<IIOC>;
	const assetsJSON = this.getNodeParameter(
		'additionalFields.__assetsCollectionJSON', i, null) as Array<IAsset>;

	if (iocsJSON !== null) iocs = iocsJSON
	if (assetsJSON !== null) assets = assetsJSON;

	if (sendEmpty && !iocs) iocs = [];
	if (sendEmpty && !assets) assets = [];

	if (iocs !== null) body.iocs = iocs
	if (assets !== null) body.assets = assets;

	let alertResponse: object;
	if ((body.iocs || body.assets) && !sendEmpty) {
		try {
			alertResponse = await apiRequest.call(this, 'GET', `alerts/${alertId}`, {}, {});
		} catch {
			throw new NodeOperationError(this.getNode(), `Cannot fetch alert with id: ${alertId}`);
		}
		if ('data' in alertResponse) {
			const alertData = (alertResponse as IDataObject).data as IAlert;

			if (body.iocs && 'iocs' in alertData) {
				const iocSanitized = (alertData.iocs as Array<IIOC>).map( i => { return {
					ioc_value: i.ioc_value,
					ioc_description: i.ioc_description,
					ioc_type_id: i.ioc_type_id,
					ioc_tlp_id: i.ioc_tlp_id,
					ioc_tags: i.ioc_tags,
					ioc_enrichment: i.ioc_enrichment,
				} }) as Array<IIOC>
				(body.iocs as Array<object>).push(...iocSanitized);
			}
			if (body.assets && 'assets' in alertData) {
				const assetSanitized = (alertData.assets as Array<IAsset>).map( a => { return {
					asset_name: a.asset_name,
					asset_description: a.asset_description,
					asset_type_id: a.asset_type_id,
					asset_ip: a.asset_ip,
					asset_domain: a.asset_domain,
					asset_tags: a.asset_tags,
					asset_enrichment: a.asset_enrichment,
				} }) as Array<IAsset>
				(body.assets as Array<object>).push(...assetSanitized);
			}
		}
	}
	response = await apiRequest.call(this, 'POST', `${endpoint}/update/${alertId}`, body, query);

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

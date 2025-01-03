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
			// ...local.alertIocProps, // No property in API schema
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
			...types.fieldProperties(types.alertFields),
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
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];
	let body: IDataObject = {};
	const alertId = this.getNodeParameter('id', i) as string;

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

	// let iocs = this.getNodeParameter('additionalFields.__iocsCollection.iocData', i, null) as Array<IIOC>;
	let assets = this.getNodeParameter(
		'additionalFields.__assetsCollection.assetData',
		i,
		null,
	) as Array<IAsset>;

	// let iocsJSON = this.getNodeParameter('additionalFields.__iocsCollectionJSON', i, null) as Array<IIOC>;
	let assetsJSON = this.getNodeParameter(
		'additionalFields.__assetsCollectionJSON',
		i,
		null,
	) as Array<IAsset>;

	// if (iocsJSON !== null)
	// 	iocs = iocsJSON

	if (assetsJSON !== null) assets = assetsJSON;

	// if (sendEmpty && !iocs) iocs = [];
	if (sendEmpty && !assets) assets = [];

	// if (iocs !== null)
	// 	body.alert_iocs = iocs

	if (assets !== null) body.alert_assets = assets;

	let alertResponse: object;
	if ((body.alert_iocs || body.alert_assets) && !sendEmpty) {
		try {
			alertResponse = await apiRequest.call(this, 'GET', `alerts/${alertId}`, {}, {});
		} catch {
			throw new NodeOperationError(this.getNode(), `Cannot fetch alert with id: ${alertId}`);
		}
		if ('data' in alertResponse) {
			let alertData = (alertResponse as any).data as IAlert;

			if (body.alert_iocs && 'iocs' in alertData) {
				(body.alert_iocs as Array<object>).push(...(alertData.iocs as Array<IIOC>));
			}
			if (body.alert_assets && 'assets' in alertData) {
				(body.alert_assets as Array<object>).push(...(alertData.assets as Array<IAsset>));
			}
		}
	}

	response = await apiRequest.call(this, 'POST', `${endpoint}/update/${alertId}`, body, query);

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

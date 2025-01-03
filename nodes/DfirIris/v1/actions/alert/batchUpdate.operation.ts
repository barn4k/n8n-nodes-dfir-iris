import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodePropertyOptions,
} from 'n8n-workflow';

import { updateDisplayOptions, NodeOperationError } from 'n8n-workflow';

import type { IIOC, IAsset } from '../../helpers/types';

import { endpoint } from './Alert.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';
import * as local from './commonDescription';

const properties: INodeProperties[] = [
	local.rAlertIds,
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
		options: [...types.returnRaw],
	},
];

const displayOptions = {
	show: {
		resource: ['alert'],
		operation: ['batchUpdate'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	utils.addAdditionalFields.call(this, body, i);
	const _b = Object.entries(body);
	let newBody: IDataObject = Object.fromEntries(_b);

	let kvUI = this.getNodeParameter(
		'___alertContextKV.parameters',
		i,
		null,
	) as INodePropertyOptions[];
	let jsUI = this.getNodeParameter('___alertContextJSON', i, null) as string;

	if (kvUI !== null && kvUI.length > 0) {
		newBody.alert_context = Object.fromEntries(
			kvUI.map((p: INodePropertyOptions) => [p.name, p.value]),
		);
	} else if (jsUI !== null) {
		try {
			newBody.alert_context = JSON.parse(jsUI);
		} catch {
			throw new NodeOperationError(this.getNode(), 'JSON parameter need to be an valid JSON', {
				itemIndex: i,
			});
		}
	}

	const options = this.getNodeParameter('options', i, {});

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

	let iocsJSON = this.getNodeParameter(
		'additionalFields.__iocsCollectionJSON',
		i,
		null,
	) as Array<IIOC>;
	let assetsJSON = this.getNodeParameter(
		'additionalFields.__assetsCollectionJSON',
		i,
		null,
	) as Array<IAsset>;

	if (iocsJSON !== null) iocs = iocsJSON;

	if (assetsJSON !== null) assets = assetsJSON;

	if (iocs !== null) newBody.alert_iocs = iocs;

	if (assets !== null) newBody.alert_assets = assets;

	body = {
		alert_ids: this.getNodeParameter('ids', i) as string,
		updates: newBody,
	};

	response = await apiRequest.call(this, 'POST', `${endpoint}/batch/update`, body, query);

	const isRaw = (options.isRaw as boolean) || false;
	let responseModified = response as any;

	if (!isRaw) responseModified = { status: 'success' };

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseModified as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}

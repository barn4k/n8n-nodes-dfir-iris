import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodePropertyOptions,
} from 'n8n-workflow';

import type { IIOC, IAsset } from '../../helpers/types';

import { updateDisplayOptions, NodeOperationError } from 'n8n-workflow';

import { endpoint } from './Case.resource';
import { apiRequest } from '../../transport';
import { types, utils } from '../../helpers';

const properties: INodeProperties[] = [
	{
		displayName: 'Case SOC ID',
		name: 'case_soc_id',
		type: 'string',
		description: 'A SOC ticket reference',
		default: '',
		required: true,
	},
	{
		displayName: 'Case Customer Name or ID',
		name: 'case_customer',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getCustomers',
		},
		default: '',
		required: true,
	},
	{
		displayName: 'Case Name',
		name: 'case_name',
		type: 'string',
		default: '',
		required: true,
	},
	{
		displayName: 'Case Description',
		name: 'case_description',
		type: 'string',
		default: '',
		required: true,
	},

	// ...types.alertSeverity,
	// ...types.alertStatus,
	{
		displayName: 'Alert Title',
		name: 'alert_title',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Case Classification Name or ID',
				name: 'classification_id',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getCaseClassifications',
				},
				default: '',
			},
			{
				displayName: 'Custom Attributes',
				name: 'custom_attributes',
				type: 'json',
				default: 0,
				description: 'Add custom attributes',
			},
		],
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [...types.returnRaw, ...types.fieldProperties(types.caseFields)],
	},
];

const displayOptions = {
	show: {
		resource: ['case'],
		operation: ['create'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let query: IDataObject = { cid: this.getNodeParameter('cid', i, 0) as number };
	let response: INodeExecutionData[];
	let body: IDataObject = {};

	body.alert_title = this.getNodeParameter('alert_title', i) as string;
	body.alert_customer_id = this.getNodeParameter('alert_customer_id', i) as number;
	body.alert_severity_id = this.getNodeParameter('alert_severity_id', i) as number;
	body.alert_status_id = this.getNodeParameter('alert_status_id', i) as number;

	utils.addAdditionalFields.call(this, body, i);

	let kvUI = this.getNodeParameter('alertContextKV.parameters', i, null) as INodePropertyOptions[];
	let jsUI = this.getNodeParameter('alertContextJSON', i, null) as string;

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

	if (iocs !== null) body.alert_iocs = iocs;

	if (assets !== null) body.alert_assets = assets;

	response = await apiRequest.call(this, 'POST', `${endpoint}/add`, body, query);

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

import type { INodeProperties } from 'n8n-workflow';

export const rAssetId: INodeProperties = {
	displayName: 'Asset Name or ID',
	name: 'asset_id',
	type: 'options',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	typeOptions: {
		loadOptionsMethod: 'getAssets',
		loadOptionsDependsOn: ['cid'],
	},
	default: '',
	required: true,
};

export const assetName: INodeProperties = {
	displayName: 'Asset Name',
	name: 'asset_name',
	type: 'string',
	default: '',
};

export const rAssetName: INodeProperties = {
	displayName: 'Asset Name',
	name: 'asset_name',
	type: 'string',
	default: '',
	required: true,
};

export const assetType: INodeProperties = {
	displayName: 'Asset Type Name or ID',
	name: 'asset_type_id',
	type: 'options',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	typeOptions: {
		loadOptionsMethod: 'getAssetTypes',
	},
	default: '',
};

export const rAssetType: INodeProperties = {
	displayName: 'Asset Type Name or ID',
	name: 'asset_type_id',
	type: 'options',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	typeOptions: {
		loadOptionsMethod: 'getAssetTypes',
	},
	default: '',
	required: true,
};

export const assetAnalysisStatus: INodeProperties = {
	displayName: 'Asset Analysis Status',
	name: 'analysis_status_id',
	type: 'options',
	options: [
		{ value: 1, name: 'Unspecified' },
		{ value: 2, name: 'To Be Done' },
		{ value: 3, name: 'Started' },
		{ value: 4, name: 'Pending' },
		{ value: 5, name: 'Canceled' },
		{ value: 6, name: 'Done' },
	],
	default: 1,
};

export const assetCompromiseStatus: INodeProperties = {
	displayName: 'Asset Compromise Status',
	name: 'asset_compromise_status_id',
	type: 'options',
	options: [
		{ value: 0, name: 'To Be Determined' },
		{ value: 1, name: 'Compromised' },
		{ value: 2, name: 'Not Compromised' },
		{ value: 3, name: 'Unknown' },
	],
	default: 0,
};

export const assetDescription: INodeProperties = {
	displayName: 'Asset Value',
	name: 'asset_description',
	type: 'string',
	default: '',
};

export const assetDomain: INodeProperties = {
	displayName: 'Asset Domain',
	name: 'asset_domain',
	type: 'string',
	default: '',
};

export const assetInfo: INodeProperties = {
	displayName: 'Asset Info',
	name: 'asset_info',
	type: 'string',
	default: '',
};

export const assetIP: INodeProperties = {
	displayName: 'Asset IP',
	name: 'asset_ip',
	type: 'string',
	default: '',
};

export const assetTags: INodeProperties = {
	displayName: 'Asset Tags',
	name: 'asset_tags',
	type: 'string',
	default: '',
	description: 'Comma-separated list of tags',
};

export const iocReference: INodeProperties = {
	displayName: 'IOC Reference Names or IDs',
	name: 'ioc_links',
	placeholder: 'Add IOC Reference',
	type: 'multiOptions',
	typeOptions: {
		// multipleValues: true,
		loadOptionsMethod: 'getIOCs',
		loadOptionsDependsOn: ['cid'],
	},
	default: [],
	description:
		'Related IOCs. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
};
